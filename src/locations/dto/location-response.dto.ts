export class LocationResponseDto {
  id: string;
  name: string;
  address?: string;
  category?: string;
  created_by?: string;
  is_verified?: boolean;
  lat: number;
  lng: number;
  rating?: number;
  place_id?: string;
}
