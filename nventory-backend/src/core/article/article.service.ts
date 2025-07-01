import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository, DataSource } from 'typeorm';
import { FindArticleDto } from './dto/find-article.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        private dataSource: DataSource
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

    async update(id: number, updateData: Partial<Article>): Promise<Article | null> {
        const article = await this.articleRepository.findOneBy({ articleID: id });
        if (!article) return null;
        // Update only provided fields
        if (updateData.articleName !== undefined) article.articleName = updateData.articleName;
        if (updateData.articleInformation !== undefined) article.articleInformation = updateData.articleInformation;
        if (updateData.articleAmount !== undefined) article.articleAmount = Math.round(updateData.articleAmount);
        if (updateData.articlePrice !== undefined) article.articlePrice = Math.round((updateData.articlePrice + Number.EPSILON) * 100) / 100;
        // Optionally update shelf/warehouse if needed
        return this.articleRepository.save(article);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.articleRepository.delete({ articleID: id });
        return !!result.affected && result.affected > 0;
    }

    async findOne(id: number) {
        return this.articleRepository.findOne({ where: { articleID: id } });
    }

    async getProductStats(articleID: string) {
        // Use a raw SQL query to match the product stats logic, using articleID
        const result = await this.dataSource.query(`
            SELECT 
                at.articleID,
                a.articleName AS Produktname,
                ROUND(AVG(CASE WHEN at.transactionType = 'in' THEN at.transactionPrice ELSE NULL END), 2) AS DurchschnittlicherKaufpreis,
                a.articleAmount AS Bestand,
                ROUND(AVG(CASE WHEN at.transactionType = 'out' THEN at.transactionPrice ELSE NULL END), 2) AS DurchschnittlicherVerkaufspreis,
                SUM(CASE 
                    WHEN at.transactionType = 'out' AND at.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                    THEN at.transactionPrice * at.transactionAmount 
                    ELSE 0 
                END) AS Gesamtumsatz,
                SUM(CASE 
                    WHEN at.transactionType = 'out' AND at.transactionTimestamp >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                    THEN at.transactionAmount 
                    ELSE 0 
                END) AS Verkaufsmenge
            FROM articletransactions as at
            LEFT JOIN article a ON at.articleID = a.articleID
            WHERE at.articleID = ?
            GROUP BY at.articleID, a.articleName, a.articleAmount
        `, [articleID]);
        if (!result?.[0]) {
            return { success: false, error: 'Kein Produkt mit dieser Artikelnummer gefunden oder keine Daten vorhanden.' };
        }
        return { success: true, data: result[0] };
    }
}
