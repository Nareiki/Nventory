import { Cat } from 'src/cat/cat.interface';
export declare class CatsService {
    private cats;
    findAll(): Cat[];
    create(cat: Cat): Cat;
}
