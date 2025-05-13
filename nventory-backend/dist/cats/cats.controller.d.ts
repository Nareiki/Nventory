import { CatsService } from './cats.service';
import { Cat } from 'src/cat/cat.interface';
export declare class CatsController {
    private catsService;
    constructor(catsService: CatsService);
    findAll(): Promise<Cat[]>;
    create(cat: Cat): Promise<Cat>;
}
