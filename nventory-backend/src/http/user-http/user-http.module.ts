import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'your_jwt_secret', // Use env variable in production
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserHttpModule { }
