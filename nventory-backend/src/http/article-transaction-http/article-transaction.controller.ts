import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ArticleTransactionService } from 'src/core/article-transaction/article-transaction.service';
import { SalesPerDayDto } from 'src/core/article-transaction/dto/sales-per-day.dto';
import { ArticleWithSoldDto } from 'src/core/article-transaction/dto/article-with-sold.dto';
import { TransactionListDto } from 'src/core/article-transaction/dto/transaction-list.dto';
import { CreateTransactionDto } from 'src/core/article-transaction/dto/create-transaction.dto';
import { TopSoldArticleDto } from 'src/core/article-transaction/dto/top-sold-article.dto';

@Controller('article-transaction')
export class ArticleTransactionController {

    constructor(private readonly articleTransactionService: ArticleTransactionService) { }


    @Get('top-sold')
    async topSold(): Promise<TopSoldArticleDto[]> {
        return this.articleTransactionService.findTopSoldItems();
    }

    @Get('sales-per-day')
    async salesPerDay(): Promise<SalesPerDayDto[]> {
        return this.articleTransactionService.findSalesPerDay();
    }

    @Get('with-sold')
    async getArticlesWithSold30(@Query('days') days?: string): Promise<ArticleWithSoldDto[]> {
        const daysNum = days ? parseInt(days, 10) : 30;
        return this.articleTransactionService.getArticlesWithDays(daysNum);
    }

    @Get('transactions')
    async getTransactionList(): Promise<TransactionListDto[]> {
        return this.articleTransactionService.getTransactionList();
    }

    @Post('transaction')
    async createTransaction(@Body() dto: CreateTransactionDto) {
        // If no timestamp is provided, set it to now
        if (!dto.transactionTimestamp) {
            dto.transactionTimestamp = new Date();
        }
        return this.articleTransactionService.createTransaction(dto);
    }

    @Post('transaction-stock')
    async createTransactionAndUpdateStock(@Body() dto: CreateTransactionDto) {
        try {
            return await this.articleTransactionService.createTransactionAndUpdateStock(dto);
        } catch (e) {
            return { success: false, msg: e.message };
        }
    }

    // Dashboard statistics for frontend
    @Get('dashboard-stats')
    async getDashboardStats(@Query('threshold') threshold: number = 5) {
        return this.articleTransactionService.dashboardStats(threshold);
    }

    @Get('statistics')
    async getStatistics() {
        const data = await this.articleTransactionService.getStatistics();
        return { success: true, data };
    }

    @Post('update/:id')
    async updateTransaction(@Body() updateData: Partial<CreateTransactionDto>, @Query('id') id: string) {
        const updated = await this.articleTransactionService.updateTransaction(Number(id), updateData);
        if (!updated) {
            return { success: false, message: 'Transaction not found' };
        }
        return { success: true, data: updated };
    }
}
