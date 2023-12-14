import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectRepository,
  ArangoRepository,
  ResultList,
  ArangoNewOldResult,
} from 'nest-arango';
import { SupplierEntity } from '../../entities/supplier/supplier.entity';
import { MyDatabase } from '../../database/database';
import { aql } from 'arangojs';
@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly SupplierRepository: ArangoRepository<SupplierEntity>,
  ) {}

  async create(Supplier: SupplierEntity): Promise<SupplierEntity> {
    return await this.SupplierRepository.save(Supplier);
  }

  async filter() {
    return await MyDatabase.getDb().query(aql`
      FOR supplier IN Suppliers
      FILTER supplier.type == "fire"
      RETURN supplier
    `);
  }

  async findAll(): Promise<ResultList<SupplierEntity>> {
    return await this.SupplierRepository.findAll();
  }

  async findOne(SupplierName: string): Promise<SupplierEntity | null> {
    return await this.SupplierRepository.findOneBy({ SupplierName });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    SupplierName: string,
    updatedSupplier: Partial<SupplierEntity>,
  ): Promise<ArangoNewOldResult<any>> {
    // Find the existing Supplier
    const existingSupplier = await this.SupplierRepository.findManyBy({
      SupplierName,
    });

    if (!existingSupplier) {
      throw new NotFoundException(
        `Supplier with SupplierName ${SupplierName} not found`,
      );
    }

    // Update the Supplier fields
    Object.assign(existingSupplier, updatedSupplier);

    // Use the `update` method to persist changes
    const updatedDocument =
      await this.SupplierRepository.update(existingSupplier);

    // Return the updated Supplier
    return updatedDocument ? updatedDocument : null;
  }

  async remove(SupplierName: string): Promise<void> {
    await this.SupplierRepository.removeBy({ SupplierName });
  }
}
