import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Req, Query, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService, PaginatedResult } from './user.service';
import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './user.dto';
import { Public } from 'src/decorators/public.decorator';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('is_active') isActive?: string,
  ): Promise<PaginatedResult<User> | User[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.userService.findAll({
      page: pageNumber,
      limit: limitNumber,
      search,
      role,
      isActive: isActiveBoolean,
    });
  }

  @Get('stats')
  getUserStats() {
    return this.userService.getUserStats();
  }

  @Get('profile/me')
  async getProfile(@Req() req: Request) {
    const token = req.cookies['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    const user = await this.userService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: user
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.userService.validateUserAndCreateSession(loginUserDto);

    if (!result.success) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.user!;

    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token'];

    if (token) {
      await this.userService.logout(token);
    }

    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout successful'
    });
  }

  @Post('logout-all')
  async logoutAll(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token'];

    if (token) {
      const user = await this.userService.validateSession(token);
      if (user) {
        await this.userService.logoutAllSessions(user.id);
      }
    }

    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'All sessions logged out successfully'
    });
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') targetUserId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request
  ) {
    const token = req.cookies['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    const currentUser = await this.userService.validateSession(token);
    if (!currentUser) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const result = await this.userService.changeUserPassword(
      targetUserId,
      changePasswordDto.password,
      currentUser
    );

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }


}

