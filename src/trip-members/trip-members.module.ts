import { Module } from '@nestjs/common';
import { TripMembersService } from './trip-members.service';
import { TripMembersController } from './trip-members.controller';

@Module({
  controllers: [TripMembersController],
  providers: [TripMembersService],
  exports: [TripMembersService],
})
export class TripMembersModule {}
