import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class article {

    @PrimaryGeneratedColumn()
    articleID: number

    @Column()
    shelfID: number

    @Column()
    articleName: string

    @Column()
    articleInformation: string

    @Column()
    articleAmount: number

    @Column()
    articlePrice: number
}
