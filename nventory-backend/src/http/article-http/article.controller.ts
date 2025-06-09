import { Controller, Get, Query, Post, Body, Put, Param, BadRequestException } from '@nestjs/common';
import { ArticleService } from 'src/core/article/article.service';
import { FindArticleDto } from 'src/core/article/dto/find-article.dto';
import { Article } from 'src/entities/article.entity';

@Controller('article')
export class ArticleController {

    constructor(private articleService: ArticleService) {

    }

    @Get()
    async findAll(@Query() query: FindArticleDto) {
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

    @Post()
    async create(@Body() article: Article) {
        if (!article.articleName || !article.articleInformation) {
            throw new BadRequestException('Article name and information are required')
        }
        if (article.articlePrice === undefined) {
            article.articlePrice = 0; // Default price if not provided
        }
        if (article.articleAmount === undefined) {
            article.articleAmount = 0; // Default amount if not provided
        }
        if (article.shelf && article.shelf.warehouse) {
            if (!article.shelf.warehouse.warehouseID) {
                throw new BadRequestException('Warehouse ID is required for the shelf');
            }
            if (!article.shelf.shelfID) {
                throw new BadRequestException('Shelf ID is required for the article');
            }
        } else {
            throw new BadRequestException('Shelf and warehouse information is required for the article');
        }
        if (article.articleID) {
            throw new BadRequestException('Article ID should not be provided for creation');
        }

        return this.articleService.create(article)
    }

    @Put(':id/price')
    async updatePrice(@Param('id') id: number, @Body('articlePrice') articlePrice: number) {
        return this.articleService.updatePrice(id, articlePrice)
    }

    @Put(':id/amount')
    async updateAmount(@Param('id') id: number, @Body('articleAmount') articleAmount: number) {
        return this.articleService.updateAmount(id, articleAmount)
    }
}
