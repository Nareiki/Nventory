import { Controller, Get, Query, Post, Body } from '@nestjs/common';
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
}
