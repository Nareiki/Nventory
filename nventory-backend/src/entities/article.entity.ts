import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Shelf } from "./shelf.entity"

@Entity()
export class Article {

    @PrimaryGeneratedColumn({ type: 'int' })
    articleID: number

    @Column({ type: 'int' })
    shelfID: number

    @Column({ type: 'varchar', length: 255 })
    articleName: string

    @Column({ type: 'text' })
    articleInformation: string

    @Column({ type: 'int' })
    articleAmount: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    articlePrice: number

    @ManyToOne(() => Shelf)
    @JoinColumn({ name: 'shelfID' })
    shelf: Shelf
}
