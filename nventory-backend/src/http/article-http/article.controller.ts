import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from 'src/core/article/article.service';
import { FindArticleDto } from 'src/core/article/dto/find-article.dto';

@Controller('article')
export class ArticleController {

    constructor(private articleService: ArticleService) {

    }

    @Get()
    async findAll(@Query() query: FindArticleDto & { Id?: number }) {

        if (query.Id !== undefined && query.id === undefined) {
            query.id = query.Id
        }

        if (query.id || query.articleName || query.articleInformation) {
            return this.articleService.findSpecific(query)
        }

        if (query.shelfId && query.warehouseId) {
            return this.articleService.findSpecific({ shelfId: query.shelfId, warehouseId: query.warehouseId })
        }

        if (query.shelfId) {
            return this.articleService.findSpecific({ shelfId: query.shelfId })
        }

        if (query.warehouseId) {
            return this.articleService.findSpecific({ warehouseId: query.warehouseId })
        }

        return this.articleService.findAll();
    }
}
