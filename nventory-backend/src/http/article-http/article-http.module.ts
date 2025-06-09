import { Module } from '@nestjs/common';
import { ArticleModule } from 'src/core/article/article.module';
import { ArticleService } from 'src/core/article/article.service';
import { ArticleController } from './article.controller';

@Module({
    imports: [ArticleModule],
    providers: [ArticleService],
    controllers: [ArticleController],
})
export class ArticleHttpModule { }
