import { ConflictException, Injectable } from '@nestjs/common';
import { LoginEmailDto } from '../dtos/login-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { SignupUserDto } from '../dtos/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async signup(signupUserDto: SignupUserDto) {
    const { email, password } = signupUserDto;

    const emailExistence = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (emailExistence) {
      throw new ConflictException('Email is already exists');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(this.configService.get<Number>('SALT')),
    );

    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    delete createdUser.password;

    return {
      ...createdUser,
      accessToken: this.generateToken(createdUser),
    };
  }
  async login(loginEmailDto: LoginEmailDto) {
    const { email, password } = loginEmailDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('Incorrect Email or password ');
    }

    const isPasswordMatches = await bcrypt.compare(password, user.password);
    if (!isPasswordMatches) {
      throw new ConflictException('Incorrect Email or password ');
    }

    delete user.password;

    return {
      ...user,
      accessToken: this.generateToken(user),
    };
  }

  private generateToken(user: User) {
    return this.jwtService.sign(
      { id: String(user.id), email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('USER_JWT_SECRET'),
        expiresIn:
          Number(this.configService.get<number>('USER_JWT_EXPIRY')) || 3600,
      },
    );
  }
}
