import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { SUPABASE_CLIENT } from '../supabase/supabase.provider';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface UserRecord {
  id: string;
  email: string;
  encrypted_password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { name, email, password } = registerDto;

    const { data: existingUser } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await this.supabase.from('profiles').insert({
      email,
      encrypted_password: hashedPassword,
      name,
    });
    if (error) {
      throw new ConflictException(error.message);
    }

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const { data: user, error } = await this.supabase
      .from('profiles')
      .select('id, email, encrypted_password')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const typedUser = user as UserRecord;

    const isPasswordValid = await bcrypt.compare(
      password,
      typedUser.encrypted_password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: typedUser.id, email: typedUser.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
