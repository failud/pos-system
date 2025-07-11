import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
    
    // Remove password from response
    return users.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_active: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateUserDto.password, saltRounds);
      updateUserDto['password_hash'] = hashedPassword;
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    
    // Remove password from response
    const { password_hash, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.is_active = false;
    await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username, is_active: true },
    });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: loginUserDto.username, is_active: true },
    });

    if (user && await bcrypt.compare(loginUserDto.password, user.password_hash)) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  }
}