import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTransaction } from 'src/entities/article-transactions.entity';
import { Repository } from 'typeorm';
import { TopSoldArticleDto } from './dto/top-sold-article.dto';
import { SalesPerDayDto } from './dto/sales-per-day.dto';
import { ArticleWithSoldDto } from './dto/article-with-sold.dto';
import { TransactionListDto } from './dto/transaction-list.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class ArticleTransactionService {
    constructor(
        @InjectRepository(ArticleTransaction)
        private readonly articleTransactionRepository: Repository<ArticleTransaction>,
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

    async findSalesPerDay(): Promise<SalesPerDayDto[]> {
        const qb = this.articleTransactionRepository.createQueryBuilder('t')
            .select('DATE(t.transactionTimestamp)', 'date')
            .addSelect('SUM(t.transactionAmount)', 'sales')
            .where('t.transactionType = :type', { type: 'out' })
            .andWhere('t.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
            .groupBy('date')

        return qb.getRawMany<SalesPerDayDto>();
    }

    async getArticlesWithDays(days: number): Promise<ArticleWithSoldDto[]> {
        const qb = this.articleTransactionRepository.createQueryBuilder('t')
            .select('a.articleID', 'artikelnummer')
            .addSelect('a.articleName', 'produktname')
            .addSelect('a.articleAmount', 'menge')
            .addSelect("COALESCE(SUM(CASE WHEN t.transactionType = 'out' AND t.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL :days DAY) THEN t.transactionAmount ELSE 0 END),0)", 'sold')
            .leftJoin('t.article', 'a')
            .groupBy('a.articleID');
        qb.setParameter('days', days);
        return qb.getRawMany<ArticleWithSoldDto>();
    }

    async getTransactionList(): Promise<TransactionListDto[]> {
        const qb = this.articleTransactionRepository.createQueryBuilder('t')
            .select('t.transactionID', 'transactionID')
            .addSelect('t.transactionTimestamp', 'transactionTimestamp')
            .addSelect('t.transactionType', 'transactionType')
            .addSelect('t.transactionAmount', 'transactionAmount')
            .addSelect('t.transactionPrice', 'transactionPrice')
            .addSelect('a.articleID', 'artikelnummer')
            .addSelect('a.articleName', 'produktname')
            .innerJoin('t.article', 'a')
            .orderBy('t.transactionTimestamp', 'DESC')
            .limit(1000);
        return qb.getRawMany<TransactionListDto>();
    }

    async createTransaction(dto: CreateTransactionDto) {
        const transaction = this.articleTransactionRepository.create(dto);
        return this.articleTransactionRepository.save(transaction);
    }
}
