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
        const isMatch = await this.userService.comparePassword(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid username or password');
        }
        // Create JWT token
        const payload = { sub: user.userID, username: user.username };
        const token = this.jwtService.sign(payload);
        // Return token and user info (omit password)
        const { password, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        // Explicitly map all required fields for DB compatibility
        const userToCreate = {
            username: createUserDto.username,
            password: createUserDto.password,
            firstname: createUserDto.firstname,
            lastname: createUserDto.lastname,
            email: createUserDto.email,
            company: createUserDto.company,
            warehouseID: createUserDto.warehouseID,
            status: createUserDto.status ?? true
        };
        return this.userService.create(userToCreate);
    }
}

