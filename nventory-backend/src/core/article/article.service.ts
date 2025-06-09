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
        const newArticle: Article = this.articleRepository.create(article)
        return this.articleRepository.save(newArticle)
    }
}
