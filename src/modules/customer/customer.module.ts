import { Module } from '@nestjs/common';
import { CustomerController } from '../../controllers/customer/customer.controller';
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerEntity } from '../../entities/customer/customer.entity';

@Module({
  imports: [CustomerEntity],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
