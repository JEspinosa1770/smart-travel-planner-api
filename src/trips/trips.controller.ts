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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  async create(
    @Body() createTripDto: CreateTripDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tripsService.create(createTripDto, req.user.userId);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public trips' })
  async findAll() {
    return this.tripsService.findAll();
  }

  @Get('my-trips')
  @ApiOperation({ summary: 'Get own trips' })
  async findMyTrips(@Req() req: RequestWithUser) {
    return this.tripsService.findMyTrips(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by id' })
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.tripsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trip' })
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tripsService.update(id, updateTripDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete trip' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.tripsService.remove(id, req.user.userId);
  }
}
