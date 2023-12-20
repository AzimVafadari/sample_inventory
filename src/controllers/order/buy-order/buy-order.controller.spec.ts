import { Test, TestingModule } from '@nestjs/testing';
import { BuyOrderController } from './buy-order.controller';

describe('BuyOrderController', () => {
  let controller: BuyOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyOrderController],
    }).compile();

    controller = module.get<BuyOrderController>(BuyOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
