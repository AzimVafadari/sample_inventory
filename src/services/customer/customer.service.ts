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
    await this.customerRepository.save(customer);
    return { result: 'the customer is created' };
  }
  async findAll(): Promise<ResultList<CustomerEntity>> {
    return await this.customerRepository.findAll();
  }
  async update(_id: string, updatedCustomer: CustomerEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR cus IN Customers 
        FILTER cus._id == ${_id}
        UPDATE cus WITH ${updatedCustomer} IN Customers
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
    FILTER cus._id == ${customerId}
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

  async findBasedName(customerName: string): Promise<object> {
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
  async findBasedKey(key: string): Promise<object> {
    const customerDocument = await MyDatabase.getDb().query(aql`
      FOR c IN Customers
      FILTER c._key == ${key}
      RETURN c
    `);
    const Customer = await customerDocument.all();
    if (Customer) {
      return Customer;
    } else {
      return { error: 'customer not found' };
    }
  }
}
