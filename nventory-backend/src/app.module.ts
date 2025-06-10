import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseModule } from './core/warehouse/warehouse.module';
import { WarehouseHttpModule } from './http/warehouse-http/warehouse-http.module';

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
    WarehouseHttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
