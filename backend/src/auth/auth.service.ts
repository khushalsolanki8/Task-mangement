import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Guest Login: Creates a transient anonymous guest account and returns JWT token
   */
  async guestLogin() {
    const randomGuestId = Math.random().toString(36).substring(2, 7);
    const guestUser = await this.prisma.user.create({
      data: {
        name: `Guest User #${randomGuestId}`,
        isGuest: true,
        email: null,
        themeMode: 'light',
        accentColor: 'blue',
      },
    });

    const payload = { sub: guestUser.id, isGuest: true };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: guestUser.id,
        name: guestUser.name,
        isGuest: true,
        themeMode: guestUser.themeMode,
        accentColor: guestUser.accentColor,
      },
    };
  }

  /**
   * User Registration
   */
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        isGuest: false,
      },
    });

    const payload = { sub: user.id, email: user.email, isGuest: false };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: false,
      },
    };
  }

  /**
   * User Login
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, isGuest: false };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
      },
    };
  }
}
