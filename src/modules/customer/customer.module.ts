import { Module } from '@nestjs/common';
import { CustomerController } from '../../controllers/customer/customer.controller';
import { CustomerService } from '../../services/customer/customer.service';
import { ArangoModule } from 'nest-arango';
import { CustomerEntity } from 'src/entities/customer/customer.entity';

@Module({
  imports: [ArangoModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
