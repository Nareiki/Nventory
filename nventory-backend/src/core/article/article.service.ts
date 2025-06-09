import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import { FindArticleDto } from './dto/find-article.dto';

@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
    ) { }

    findSpecific(dto: FindArticleDto): Promise<Article[]> {
        const where: any = {};

        if (dto.id !== undefined) { where.articleID = dto.id; }
        if (dto.articleName !== undefined) { where.articleName = dto.articleName; }
        if (dto.articleInformation !== undefined) { where.articleInformation = dto.articleInformation; }
        if (dto.shelfId !== undefined) { where.shelf = { shelfID: dto.shelfId }; }
        if (dto.warehouseId !== undefined) {
            if (where.shelf) {
                where.shelf.warehouse = { warehouseID: dto.warehouseId };
            } else {
                where.shelf = { warehouse: { warehouseID: dto.warehouseId } };
            }
        }

        return this.articleRepository.find({
            select: {
                articleID: true,
                articleName: true,
                articleInformation: true
            },
            where: where,
            // relations: ['shelf', 'shelf.warehouse']
        });
    }

    findAll(): Promise<Article[]> {
        return this.articleRepository.find()
    }

    create(article: Article): Promise<Article> {
        // Ensure price is rounded to 2 decimals and amount is integer
        if (article.articlePrice !== undefined) {
            article.articlePrice = Math.round((article.articlePrice + Number.EPSILON) * 100) / 100;
        }
        if (article.articleAmount !== undefined) {
            article.articleAmount = Math.round(article.articleAmount);
        }
        const newArticle: Article = this.articleRepository.create(article)
        return this.articleRepository.save(newArticle)
    }

    async updatePrice(id: number, articlePrice: number): Promise<Article | null> {
        const article = await this.articleRepository.findOneBy({ articleID: id })
        if (!article) return null
        // Round price to 2 decimals
        article.articlePrice = Math.round((articlePrice + Number.EPSILON) * 100) / 100;
        return this.articleRepository.save(article)
    }

    async updateAmount(id: number, articleAmount: number): Promise<Article | null> {
        const article = await this.articleRepository.findOneBy({ articleID: id })
        if (!article) return null
        // Ensure amount is integer
        article.articleAmount = Math.round(articleAmount);
        return this.articleRepository.save(article)
    }
}
