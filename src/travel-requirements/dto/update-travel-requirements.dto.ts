import { PartialType } from '@nestjs/swagger';
import { CreateTravelRequirementsDto } from './create-travel-requirements.dto';

export class UpdateTravelRequirementsDto extends PartialType(
  CreateTravelRequirementsDto,
) {}
