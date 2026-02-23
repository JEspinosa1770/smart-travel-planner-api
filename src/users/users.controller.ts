import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(@Req() req: RequestWithUser) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admins');
    }
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  async getMe(@Req() req: RequestWithUser) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id (admin only)' })
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admins');
    }
    return this.usersService.findOne(id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update own profile' })
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by id (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admins');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admins');
    }
    return this.usersService.remove(id);
  }
}
