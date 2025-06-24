import { Body, Controller, Get, Param, Post, Put, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/core/user/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }

    @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
        if (!loginDto.username || !loginDto.password) {
            throw new BadRequestException('Username and password are required');
        }
        const user = await this.userService.findByUsername(loginDto.username);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }
        const isMatch = await this.userService.comparePassword(loginDto.password, user.userPassword);
        if (!isMatch) {
            throw new BadRequestException('Invalid username or password');
        }
        // Create JWT token
        const payload = { sub: user.userID, username: user.userName };
        const token = this.jwtService.sign(payload);
        // Return token and user info (omit password)
        const { userPassword, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}

