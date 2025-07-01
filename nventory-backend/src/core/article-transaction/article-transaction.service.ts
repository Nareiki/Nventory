import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTransaction } from 'src/entities/article-transactions.entity';
import { Repository } from 'typeorm';
import { TopSoldArticleDto } from './dto/top-sold-article.dto';
import { SalesPerDayDto } from './dto/sales-per-day.dto';
import { ArticleWithSoldDto } from './dto/article-with-sold.dto';
import { TransactionListDto } from './dto/transaction-list.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Article } from 'src/entities/article.entity';
import { InjectRepository as InjectArticleRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleTransactionService {
    constructor(
        @InjectRepository(ArticleTransaction)
        private readonly articleTransactionRepository: Repository<ArticleTransaction>,
        @InjectArticleRepository(Article)
        private readonly articleRepository: Repository<Article>,
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

    async updateTransaction(id: number, updateData: Partial<CreateTransactionDto>): Promise<ArticleTransaction | null> {
        const transaction = await this.articleTransactionRepository.findOneBy({ transactionID: id });
        if (!transaction) return null;
        // Only update provided fields
        if (updateData.articleID !== undefined) transaction.articleID = updateData.articleID;
        if (updateData.transactionType !== undefined) transaction.transactionType = updateData.transactionType;
        if (updateData.transactionAmount !== undefined) transaction.transactionAmount = updateData.transactionAmount;
        if (updateData.transactionPrice !== undefined) transaction.transactionPrice = updateData.transactionPrice;
        if (updateData.transactionTimestamp !== undefined) transaction.transactionTimestamp = updateData.transactionTimestamp;
        return this.articleTransactionRepository.save(transaction);
    }

    async dashboardStats(threshold: number = 5) {
        // Total products
        const totalProducts = await this.articleRepository.count();
        // Total quantity
        const totalQuantity = await this.articleRepository
            .createQueryBuilder('a')
            .select('SUM(a.articleAmount)', 'sum')
            .getRawOne();
        // Inventory value
        const inventoryValue = await this.articleRepository
            .createQueryBuilder('a')
            .select('SUM(a.articleAmount * a.articlePrice)', 'sum')
            .getRawOne();
        // Low stock items
        const lowItems = await this.articleRepository
            .createQueryBuilder('a')
            .where('a.articleAmount <= :threshold', { threshold })
            .orderBy('a.articleAmount', 'ASC')
            .addOrderBy('a.articleName', 'ASC')
            .getRawMany();
        // Top 5 bestsellers (30 days)
        const topItems = await this.articleTransactionRepository.createQueryBuilder('t')
            .select('a.articleID', 'Artikelnummer')
            .addSelect('a.articleName', 'Produktname')
            .addSelect('SUM(t.transactionAmount)', 'sold')
            .innerJoin('t.article', 'a')
            .where('t.transactionType = :type', { type: 'out' })
            .andWhere('t.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)')
            .groupBy('t.articleID')
            .addGroupBy('a.articleName')
            .orderBy('sold', 'DESC')
            .limit(5)
            .getRawMany();
        // Sales last 7 days
        const salesPerDay = await this.articleTransactionRepository.createQueryBuilder('t')
            .select('DATE(t.transactionTimestamp)', 'd')
            .addSelect('SUM(t.transactionAmount)', 's')
            .where('t.transactionType = :type', { type: 'out' })
            .andWhere('t.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
            .groupBy('d')
            .getRawMany();
        // Prepare labels and values for chart
        const tmp: Record<string, number> = {};
        for (const r of salesPerDay) {
            tmp[r.d] = Number(r.s);
        }
        const labels: string[] = [];
        const values: number[] = [];

        // Use local time for day calculation to match MySQL CURDATE() (which is local server time, not UTC)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Always show the last 7 days, even if there is no data for some days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const key = `${year}-${month}-${day}`;
            labels.push(`${day}.${month}`);
            values.push(tmp[d.toString()] ?? 0);
        }
        return {
            totalProducts,
            totalQuantity: Number(totalQuantity.sum) || 0,
            inventoryValue: Number(inventoryValue.sum) || 0,
            lowItems,
            topItems,
            salesLabels: labels,
            salesValues: values
        };
    }

    async getStatistics() {
        // Custom statistics query matching the provided SQL
        const qb = this.articleTransactionRepository.createQueryBuilder('at')
            .select('at.articleID', 'Artikelnummer')
            .addSelect('a.articleName', 'Produktname')
            .addSelect(`CASE 
                WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN 0
                ELSE SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice * at.transactionAmount ELSE 0 END)
            END`, 'Gesamtumsatz')
            .addSelect(`CASE 
                WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN 0
                ELSE SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionAmount ELSE 0 END)
            END`, 'Gesamtmenge')
            .addSelect(`CASE 
                WHEN SUM(CASE WHEN at.transactionType = 'out' THEN 1 ELSE 0 END) = 0 THEN NULL
                ELSE (SUM(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice ELSE 0 END) -
                      SUM(CASE WHEN at.transactionType = 'in' THEN at.transactionPrice ELSE 0 END))
            END`, 'Deckungsbeitrag')
            .leftJoin('at.article', 'a')
            .groupBy('at.articleID')
            .addGroupBy('a.articleName');
        return await qb.getRawMany();
    }

    async createTransactionAndUpdateStock(dto: CreateTransactionDto) {
        // Find the article
        const article = await this.articleRepository.findOneBy({ articleID: dto.articleID });
        if (!article) throw new Error('Artikel nicht gefunden');
        // Calculate new stock
        let mengeNeu = article.articleAmount;
        if (dto.transactionType === 'in') {
            mengeNeu += dto.transactionAmount;
        } else if (dto.transactionType === 'out') {
            mengeNeu -= dto.transactionAmount;
            if (mengeNeu < 0) throw new Error(`Ausbuchung größer als Bestand (${article.articleAmount})`);
        } else {
            throw new Error('Ungültiger Transaktionstyp');
        }
        // Update article stock
        article.articleAmount = mengeNeu;
        await this.articleRepository.save(article);
        // Log transaction
        const transaction = this.articleTransactionRepository.create({
            ...dto,
            transactionTimestamp: new Date()
        });
        await this.articleTransactionRepository.save(transaction);
        return { success: true, mengeNeu };
    }
}
