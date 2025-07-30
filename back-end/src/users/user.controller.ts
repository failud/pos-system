import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to get user',
        error: error.message
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>, @Res() res: Response) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.remove(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  }

  
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.validateUserAndCreateSession(loginUserDto);

      if (!result.success) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Type assertion - we know result.user exists when success is true
      const user = result.user!;

      // Set JWT token in HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['auth_token'];

      if (token) {
        await this.userService.logout(token);
      }

      // Clear the auth cookie
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
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }

  @Post('logout-all')
  async logoutAll(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['auth_token'];

      if (token) {
        // First validate the session to get user info
        const user = await this.userService.validateSession(token);
        if (user) {
          await this.userService.logoutAllSessions(user.id);
        }
      }

      // Clear the auth cookie
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
    } catch (error) {
      console.error('Logout all error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Logout all failed',
        error: error.message
      });
    }
  }

  @Get('profile/me')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['auth_token'];

      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'No authentication token found'
        });
      }

      const user = await this.userService.validateSession(token);

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid or expired session'
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }
}