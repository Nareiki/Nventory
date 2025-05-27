import { Module } from '@nestjs/common';
import { WarehouseModule } from 'src/core/warehouse/warehouse.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from 'src/core/warehouse/warehouse.service';

@Module({
    imports: [WarehouseModule],
    providers: [WarehouseService],
    controllers: [WarehouseController],
})
export class WarehouseHttpModule { }
