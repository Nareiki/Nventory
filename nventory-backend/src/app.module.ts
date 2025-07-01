import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { ShelfModule } from './core/shelf/shelf.module';
import { ShelfHttpModule } from './http/shelf-http/shelf-http.module';
import { ArticleHttpModule } from './http/article-http/article-http.module';
import { UserModule } from './core/user/user.module';
import { UserHttpModule } from './http/user-http/user-http.module';
import { ArticleModule } from './core/article/article.module';
import { ArticleTransactionModule } from './core/article-transaction/article-transaction.module';
import { ArticleTransactionHttpModule } from './http/article-transaction-http/article-transaction-http.module';
import { Warehouse } from './entities/warehouse.entity';
import { Shelf } from './entities/shelf.entity';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';
import { ArticleTransaction } from './entities/article-transactions.entity';
import { UserWarehouse } from './entities/user-warehouse.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '3306', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [Warehouse, Shelf, Article, User, ArticleTransaction, UserWarehouse],
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
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
