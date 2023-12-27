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
  async update(
    updatedSupplier: SupplierEntity,
    supplierID: string,
  ): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR sup IN Suppliers 
        FILTER sup._id == ${supplierID}
        UPDATE sup._key WITH ${updatedSupplier} IN Suppliers
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The supplier is successfully updated.' };
    } else {
      return { error: 'Supplier not found' };
    }
  }
  async remove(supplierId: string): Promise<object> {
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR sup IN Suppliers
    FILTER sup._id == ${supplierId}
    REMOVE sup IN Suppliers
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    if (isDeleted.length > 0) {
      return { message: 'supplier successfully deleted' };
    } else {
      return { error: 'supplier not found' };
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
      return { error: 'supplier not found' };
    }
  }
}
