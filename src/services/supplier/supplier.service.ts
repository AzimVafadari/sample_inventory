import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: ArangoRepository<SupplierEntity>,
  ) {}

  async create(supplier: SupplierEntity): Promise<object> {
    await this.supplierRepository.save(supplier);
    return { result: 'the supplier is created' };
  }

  async findAll(): Promise<ResultList<SupplierEntity>> {
    return await this.supplierRepository.findAll();
  }

  async update(_id: string, updatedSupplier: SupplierEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR sup IN Suppliers 
        FILTER sup._id == ${_id}
        UPDATE sup WITH ${updatedSupplier} IN Suppliers
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The supplier is successfully updated.' };
    } else {
      throw new Error('Supplier not found');
    }
  }

  async remove(supplier_key: string): Promise<object> {
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR sup IN Suppliers
    FILTER sup._key == ${supplier_key}
    REMOVE sup IN Suppliers
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    if (isDeleted.length > 0) {
      return { message: 'supplier successfully deleted' };
    } else {
      throw new Error('Supplier not found');
    }
  }

  async findOne(supplierName: string): Promise<object> {
    //This query search all suppliers that their name starts with supplierName
    //ChatGPT did this query
    const supplier = await MyDatabase.getDb().query(aql`
    FOR supplier IN Suppliers
    FILTER LIKE(supplier.supplier_name, CONCAT(${supplierName}, '%'))
    RETURN supplier
    `);
    const isExist = supplier.all();
    if ((await isExist).length > 0 && supplierName !== '.') {
      return isExist;
    } else {
      throw new Error('Supplier not found');
    }
  }
}
