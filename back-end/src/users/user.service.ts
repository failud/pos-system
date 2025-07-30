import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserSession } from './user-session.entity';
import { CreateUserDto, LoginUserDto } from './user.dto';


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

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'updated_at'],
    });
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
    try {

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
    } catch (error) {
      console.error('Error in validateUserAndCreateSession:', error);
      throw error;
    }
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
    try {
      const result = await this.userSessionRepository.delete({ token });
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error in logout:', error);
      return false;
    }
  }

  async logoutAllSessions(userId: string): Promise<boolean> {
    try {
      const result = await this.userSessionRepository.delete({ userId });
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error in logoutAllSessions:', error);
      return false;
    }
  }

  private async cleanupExpiredSessions(userId?: string): Promise<void> {
    try {
      const query = this.userSessionRepository
        .createQueryBuilder()
        .delete()
        .where('expires_at < :now', { now: new Date() });

      if (userId) {
        query.andWhere('user_id = :userId', { userId });
      }

      await query.execute();
    } catch (error) {
      console.error('Error in cleanupExpiredSessions:', error);
    }
  }

  // Call this method periodically to clean up expired sessions
  async cleanupAllExpiredSessions(): Promise<void> {
    await this.cleanupExpiredSessions();
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}