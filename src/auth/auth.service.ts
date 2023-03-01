import {
  HttpStatus,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { EUserErrors } from './user-errors.enum';
import { Hash } from './hash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: UserRepository,
  ) {}

  async userExist(authCredentialsDto: AuthCredentialDto): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: authCredentialsDto.email },
    });
    if (user) return true;
    return false;
  }

  async signUp(
    authCredentialsDto: AuthCredentialDto,
    res: Response,
  ): Promise<User | Response> {
    const { username, email, password } = authCredentialsDto;
    const hash = await Hash.hashPassword(password);

    let user = this.usersRepository.create({ username, email, password });
    user = { ...user, username, email, password: hash };

    try {
      await this.usersRepository.save(user);
      res.status(HttpStatus.OK).json({
        message: `User ${username} with email: ${email} created`,
        user,
      });
    } catch (error) {
      if (error.code === EUserErrors.DUPLICATE_KEY) {
        throw new ConflictException(`Username ${username} already exists.`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<string> {
    const { username, password } = authCredentialDto;

    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await Hash.compare(password, user.password))) {
      return 'Signed in';
    }
    return "User doens't exists.";
  }
}
