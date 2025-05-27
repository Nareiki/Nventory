import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from 'src/entities/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    exports: [TypeOrmModule],
    providers: [WarehouseService]
})
export class WarehouseModule { }
