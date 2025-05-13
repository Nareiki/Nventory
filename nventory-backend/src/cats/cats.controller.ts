import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from 'src/cat/cat.interface';

@Controller('cats')
export class CatsController {

    constructor(private catsService: CatsService) { }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll()
    }

    @Post()
    async create(@Body() cat: Cat): Promise<Cat> {
        return this.catsService.create(cat)
    }
}
