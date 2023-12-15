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
    const cursor = await MyDatabase.getDb().query(aql`
    FOR supplier IN Suppliers
    FILTER supplier.supplier_id == ${supplier.supplier_id}
    RETURN supplier
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'user already exist' };
    } else {
      await this.supplierRepository.save(supplier);
      return { result: 'the supplier is created' };
    }
  }
  async findAll(): Promise<ResultList<SupplierEntity>> {
    return await this.supplierRepository.findAll();
  }
  async update(updatedSupplier: SupplierEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR sup IN Suppliers 
        FILTER sup.supplier_id == ${updatedSupplier.supplier_id}
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
    const stringSI = supplierId;
    console.log(`${stringSI} + 1`);
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR sup IN Suppliers 
    FILTER sup.supplier_id == "2"
    REMOVE sup IN Suppliers
    RETURN OLD
    `);
    const isDeleted = deletedDocument.next();
    // console.log(isDeleted);
    if (!isDeleted) {
      return { error: 'this user  doesnt exist' };
    } else {
      return isDeleted;
    }
  }

  async findOne(supplierName: string): Promise<SupplierEntity | object> {
    const document = await this.supplierRepository.findOneBy({ supplierName });
    return document;
  }
}
