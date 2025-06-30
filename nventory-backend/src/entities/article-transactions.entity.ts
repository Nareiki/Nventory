import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";

@Entity('article_transactions')
export class ArticleTransaction {
    @PrimaryGeneratedColumn({ type: 'int' })
    transactionID: number

    @Column({ type: 'int' })
    articleID: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    transactionPrice: number

    @Column({ type: 'int' })
    transactionAmount: number

    @Column({ type: 'timestamp' })
    transactionTimestamp: Date

    @Column({ type: 'varchar', length: 5 })
    transactionType: string // 'in' or 'out'

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'articleID' })
    article: Article
}