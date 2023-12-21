import { Module } from '@nestjs/common';
import { ProductController } from '../../controllers/product/product.controller';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';

@Module({
  imports: [ProductEntity],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
