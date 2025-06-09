import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseModule } from './core/warehouse/warehouse.module';
import { WarehouseHttpModule } from './http/warehouse-http/warehouse-http.module';
import { ShelfModule } from './core/shelf/shelf.module';
import { ShelfHttpModule } from './http/shelf-http/shelf-http.module';
import { ShelfController } from './http/shelf-http/shelf.controller';
import { ArticleModule } from './core/article/article.module';
import { ArticleModule } from './http/article-http/article/article.module';
import { ArticleHttpModule } from './http/article-http/article-http/article-http.module';
import { ArticleController } from './http/article-http/article/article.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'P4ssw0rd12?',
      database: 'nventory',
      entities: [Warehouse],
      synchronize: true,
    }),
    CatsModule,
    WarehouseModule,
    WarehouseHttpModule,
    ShelfModule,
    ShelfHttpModule,
    ArticleModule,
    ArticleHttpModule
  ],
  controllers: [AppController, ShelfController, ArticleController],
  providers: [AppService],
})
export class AppModule { }
