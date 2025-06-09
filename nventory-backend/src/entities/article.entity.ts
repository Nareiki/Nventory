import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Shelf } from "./shelf.entity"

@Entity()
export class Article {

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

    @ManyToOne(() => Shelf)
    @JoinColumn({ name: 'shelfID' })
    shelf: Shelf
}
