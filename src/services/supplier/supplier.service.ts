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
      return { erorr: 'user already exist' };
    } else {
      await this.supplierRepository.save(supplier);
      return { result: 'the supplier is created' };
    }
  }
  async findAll(): Promise<ResultList<SupplierEntity>> {
    return await this.supplierRepository.findAll();
  }
  async update(
    supplierName: string,
    updatedSupplier: Partial<SupplierEntity>,
  ): Promise<object> {
    const existingSupplier = await this.supplierRepository.findOneBy({
      supplierName,
    });
    if (!existingSupplier) {
      return { error: 'user not found' };
    } else {
      Object.assign(existingSupplier, updatedSupplier);
      await this.supplierRepository.update(existingSupplier);
      return { result: 'this user updated' };
    }
  }
  async remove(supplier_id: string): Promise<SupplierEntity> {
    const document = await this.supplierRepository.removeBy({ supplier_id });
    return document as SupplierEntity;
  }

  async findOne(productName: string): Promise<SupplierEntity | object> {
    const is_deleted = await this.supplierRepository.findOneBy({ productName });
    if (is_deleted === undefined) {
      return { error: 'this user  doesnt exist' };
    } else {
      return is_deleted as SupplierEntity;
    }
  }
}
