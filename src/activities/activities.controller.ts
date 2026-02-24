import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Req() req: RequestWithUser,
  ) {
    return this.activitiesService.create(createActivityDto, req.user.userId);
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Get all activities for a trip' })
  async findByTrip(
    @Param('tripId') tripId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.activitiesService.findByTrip(tripId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by id' })
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.activitiesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Req() req: RequestWithUser,
  ) {
    return this.activitiesService.update(
      id,
      updateActivityDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.activitiesService.remove(id, req.user.userId);
  }
}
