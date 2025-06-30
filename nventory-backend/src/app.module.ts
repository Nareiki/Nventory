import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { Warehouse } from './entities/warehouse.entity';
import { ShelfModule } from './core/shelf/shelf.module';
import { ShelfHttpModule } from './http/shelf-http/shelf-http.module';
import { ArticleHttpModule } from './http/article-http/article-http.module';
import { UserModule } from './core/user/user.module';
import { UserHttpModule } from './http/user-http/user-http.module';
import { ArticleModule } from './core/article/article.module';
import { Shelf } from './entities/shelf.entity';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';
import { ArticleTransactionModule } from './core/article-transaction/article-transaction.module';
import { ArticleTransactionHttpModule } from './http/article-transaction-http/article-transaction-http.module';
import { ArticleTransaction } from './entities/article-transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'P4ssw0rd12?',
      database: 'nventory',
      entities: [Warehouse, Shelf, Article, User, ArticleTransaction],
      synchronize: true,
    }),
    CatsModule,
    ShelfModule,
    ShelfHttpModule,
    ArticleModule,
    ArticleHttpModule,
    UserModule,
    UserHttpModule,
    ArticleTransactionModule,
    ArticleTransactionHttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
