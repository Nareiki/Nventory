import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shelf {
    @PrimaryGeneratedColumn()
    shelfID: number

    @Column()
    warehouseID: number

    @Column()
    articleID: number
}