import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { CustomerEntity } from 'src/entities/customer/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: ArangoRepository<CustomerEntity>,
  ) {}
  async create(customer: CustomerEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR customer IN customers
    FILTER customer.customer_id == ${customer.customer_id}
    RETURN customer
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'user already exist' };
    } else {
      await this.customerRepository.save(customer);
      return { result: 'the customer is created' };
    }
  }
  async findAll(): Promise<ResultList<CustomerEntity>> {
    return await this.customerRepository.findAll();
  }
  async update(updatedCustomer: CustomerEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR cus IN Customers 
        FILTER cus.customer_id == ${updatedCustomer.customer_id}
        UPDATE cus._key WITH ${updatedCustomer} IN Customers
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The customer is successfully updated.' };
    } else {
      return { error: 'customer not found' };
    }
  }
  async remove(customerId: string): Promise<object> {
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR cus IN Customers
    FILTER cus.customer_id == ${customerId}
    REMOVE cus IN Customers
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    if (isDeleted.length > 0) {
      return { message: 'customer successfully deleted' };
    } else {
      return { error: 'customer not found' };
    }
  }

  async findOne(customerName: string): Promise<object> {
    //This query search all customers that their name starts with customerName
    //ChatGPT did this query
    const customer = await MyDatabase.getDb().query(aql`
    FOR customer IN Customers
    FILTER LIKE(customer.name, CONCAT(${customerName}, '%'))
    RETURN customer
    `);
    const isExist = customer.all();
    if ((await isExist).length > 0 && customerName !== '.') {
      return isExist;
    } else {
      return { error: 'customer not found' };
    }
  }
}
