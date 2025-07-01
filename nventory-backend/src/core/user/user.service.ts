import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/http/user-http/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['warehouse'] });
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { userID: id }, relations: ['warehouse'] });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username: username } });
    }

    async comparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    async create(createUserDto: CreateUserDto): Promise<{ success: boolean }> {
        // Validation
        if (!createUserDto.username || typeof createUserDto.username !== 'string' || createUserDto.username.length < 3) {
            throw new BadRequestException('Username is required and must be at least 3 characters long');
        }
        if (!createUserDto.password || typeof createUserDto.password !== 'string' || createUserDto.password.length < 6) {
            throw new BadRequestException('Password is required and must be at least 6 characters long');
        }
        if (createUserDto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserDto.email)) {
            throw new BadRequestException('Invalid email format');
        }
        // Unique check
        const existing = await this.userRepository.findOne({
            where: [
                { username: createUserDto.username },
                { email: createUserDto.email }
            ]
        });
        if (existing) {
            throw new BadRequestException('Username or email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            username: createUserDto.username,
            password: hashedPassword,
            firstname: createUserDto.firstname,
            lastname: createUserDto.lastname,
            email: createUserDto.email,
            company: createUserDto.company,
            warehouseID: createUserDto.warehouseID,
            status: createUserDto.status ?? true
        });
        await this.userRepository.save(user);
        return { success: true };
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ userID: id });
        if (!user) return null;
        if (updateUserDto.username !== undefined) {
            if (typeof updateUserDto.username !== 'string' || updateUserDto.username.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }
            user.username = updateUserDto.username;
        }
        if (updateUserDto.password !== undefined) {
            if (typeof updateUserDto.password !== 'string' || updateUserDto.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.email !== undefined && updateUserDto.email !== null) {
            if (!/^\S+@\S+\.\S+$/.test(updateUserDto.email)) {
                throw new Error('Invalid email format');
            }
        }
        if ((updateUserDto as any).warehouseID !== undefined) user.warehouseID = (updateUserDto as any).warehouseID;
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.userRepository.delete({ userID: id });
        return !!result.affected && result.affected > 0;
    }
}
