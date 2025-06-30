import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTransaction } from 'src/entities/article-transactions.entity';
import { Repository } from 'typeorm';
import { TopSoldArticleDto } from './dto/top-sold-article.dto';

@Injectable()
export class ArticleTransactionService {
    constructor(
        @InjectRepository(ArticleTransaction)
        private readonly articleTransactionRepository: Repository<ArticleTransaction>
    ) { }

    async findTopSoldItems(): Promise<TopSoldArticleDto[]> {
        const qb = this.articleTransactionRepository.createQueryBuilder('t')
            .select('t.articleID', 'articleID')
            .addSelect('a.articleName', 'articleName')
            .addSelect('SUM(t.transactionAmount)', 'sold')
            .innerJoin('t.article', 'a')
            .where('t.transactionType = :type', { type: 'out' })
            .andWhere('t.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)')
            .groupBy('t.articleID')
            .addGroupBy('a.articleName')
            .orderBy('sold', 'DESC')
            .limit(5);
        return qb.getRawMany<TopSoldArticleDto>();
    }
}
