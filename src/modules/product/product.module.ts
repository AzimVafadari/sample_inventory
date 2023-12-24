import { Module } from '@nestjs/common';
import { ProductController } from '../../controllers/product/product.controller';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { ArangoModule } from 'nest-arango';

@Module({
  imports: [ArangoModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
