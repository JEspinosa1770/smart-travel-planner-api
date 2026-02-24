import { Module } from '@nestjs/common';
import { TravelRequirementsService } from './travel-requirements.service';
import { TravelRequirementsController } from './travel-requirements.controller';

@Module({
  controllers: [TravelRequirementsController],
  providers: [TravelRequirementsService],
  exports: [TravelRequirementsService],
})
export class TravelRequirementsModule {}
