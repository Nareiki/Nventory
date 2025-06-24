import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [UserService]
})
export class UserModule { }
