import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserSession } from './user-session.entity';
import { CreateUserDto, LoginUserDto } from './user.dto';

export interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  roleStats: {
    [key: string]: number;
  };
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,

    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedResult<User> | User[]> {
    if (!options) {
      return this.userRepository.find({
        select: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at'],
      });
    }

    const { page, limit, search, role, isActive } = options;

    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.first_name',
        'user.last_name',
        'user.phone',
        'user.role',
        'user.is_active',
        'user.created_at',
        'user.updated_at'
      ]);

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.is_active = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;

    queryBuilder
      .orderBy('user.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    const users = await queryBuilder.getMany();
    const roleStats = await this.getRoleStats();
    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      roleStats,
    };
  }

  async getRoleStats(): Promise<{ [key: string]: number }> {
    const stats = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const roleStats: { [key: string]: number } = {};
    stats.forEach(stat => {
      roleStats[stat.role] = parseInt(stat.count, 10);
    });

    return roleStats;
  }

  async getUserStats() {
    const roleStats = await this.getRoleStats();
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { is_active: true } });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleStats,
    };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async validateUserAndCreateSession(loginUserDto: LoginUserDto): Promise<{
    success: boolean;
    user?: User;
    token?: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { username: loginUserDto.username },
    });

    if (!user) {
      return { success: false };
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false };
    }

    if (!user.is_active) {
      return { success: false };
    }

    await this.cleanupExpiredSessions(user.id);
    await this.userSessionRepository.delete({ userId: user.id });

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };
    const token = this.jwtService.sign(payload);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const userSession = this.userSessionRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    await this.userSessionRepository.save(userSession);

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      } as User,
      token,
    };
  }

  async validateSession(token: string): Promise<User | null> {
    const session = await this.userSessionRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!session || new Date() > session.expiresAt) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: { id: session.userId, is_active: true }
    });

    return user || null;
  }

  async logout(token: string): Promise<boolean> {
    const result = await this.userSessionRepository.delete({ token });
    return (result.affected ?? 0) > 0;
  }

  async logoutAllSessions(userId: string): Promise<boolean> {
    const result = await this.userSessionRepository.delete({ userId });
    return (result.affected ?? 0) > 0;
  }

  private async cleanupExpiredSessions(userId?: string): Promise<void> {
    const query = this.userSessionRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() });

    if (userId) {
      query.andWhere('user_id = :userId', { userId });
    }

    await query.execute();
  }

  async cleanupAllExpiredSessions(): Promise<void> {
    await this.cleanupExpiredSessions();
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User | null> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      return null;
    }

    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userSessionRepository.delete({ userId: id });
    await this.userRepository.delete(id);
  }

  async changeUserPassword(
    targetUserId: string,
    newPassword: string,
    currentUser: User
  ): Promise<{ success: boolean; message?: string }> {
    const targetUser = await this.findOne(targetUserId);
    if (!targetUser) {
      return { success: false, message: 'Target user not found' };
    }

    if (currentUser.role === 'admin') {
      await this.updatePassword(targetUserId, newPassword);
      return { success: true };
    }
    else if (currentUser.role === 'manager') {
      if (targetUser.role !== 'cashier') {
        return {
          success: false,
          message: 'Managers can only change passwords for cashiers'
        };
      }
      await this.updatePassword(targetUserId, newPassword);
      return { success: true };
    }
    else {
      return {
        success: false,
        message: 'You do not have permission to change other users passwords'
      };
    }
  }

  private async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password_hash: hashedPassword });

    await this.userSessionRepository.delete({ userId });
  }

}