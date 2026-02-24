import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TripMembersService } from './trip-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Trip Members')
@ApiBearerAuth()
@Controller('trips/:tripId/members')
export class TripMembersController {
  constructor(private readonly tripMembersService: TripMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Add a member to a trip' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  async addMember(
    @Param('tripId') tripId: string,
    @Body() addMemberDto: AddMemberDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tripMembersService.addMember(
      tripId,
      addMemberDto,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all members of a trip' })
  async findMembers(
    @Param('tripId') tripId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tripMembersService.findMembers(tripId, req.user.userId);
  }

  @Put(':memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateMemberRole(
    @Param('tripId') tripId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tripMembersService.updateMemberRole(
      tripId,
      memberId,
      updateMemberRoleDto.role,
      req.user.userId,
    );
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from a trip' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('tripId') tripId: string,
    @Param('memberId') memberId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tripMembersService.removeMember(
      tripId,
      memberId,
      req.user.userId,
    );
  }
}
