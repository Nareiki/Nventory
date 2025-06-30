import { Controller, Get, Query } from '@nestjs/common';
import { ArticleTransactionService } from 'src/core/article-transaction/article-transaction.service';
import { TopSoldArticleDto } from 'src/core/article-transaction/dto/top-sold-article.dto';

@Controller('article-transaction')
export class ArticleTransactionController {

    constructor(private readonly articleTransactionService: ArticleTransactionService) { }


    @Get('top-sold')
    async topSold(@Query() query: TopSoldArticleDto) {
        return this.articleTransactionService.findTopSoldItems();
    }

    //   SELECT A.Artikelnummer,
    //          A.Produktname,
    //          SUM(T.transactionAmount)          AS sold
    //   FROM   ArticleTransactions T
    //   JOIN   Artikel A ON A.Artikelnummer = T.articleID
    //   WHERE  T.transactionType = 'out'                                 -- nur Verkäufe
    //     AND  T.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    //   GROUP  BY T.articleID
    //   ORDER  BY sold DESC
    //   LIMIT  5";
}
