import { Injectable } from '@nestjs/common';
import { Cat } from 'src/cat/cat.interface';

@Injectable()
export class CatsService {
    private cats: Cat[] = []

    findAll(): Cat[] {
        return this.cats
    }

    create(cat: Cat): Cat {
        this.cats.push(cat)
        return cat
    }
}
