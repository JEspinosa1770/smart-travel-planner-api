import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { LocationsModule } from './locations/locations.module';
import { ActivitiesModule } from './activities/activities.module';
import { TravelRequirementsModule } from './travel-requirements/travel-requirements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    TripsModule,
    LocationsModule,
    ActivitiesModule,
    TravelRequirementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
