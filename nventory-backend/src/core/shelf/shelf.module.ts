import { Module } from '@nestjs/common';
import { ShelfService } from './shelf.service';

@Module({
  providers: [ShelfService]
})
export class ShelfModule {}
