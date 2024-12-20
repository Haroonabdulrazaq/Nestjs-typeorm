import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { EntityManager, Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';

describe('ItemsService', () => {
  let service: ItemsService;
  let itemRepository: Repository<Item>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, {
        provide: getRepositoryToken(Item),
        useValue: {
          find: jest.fn()
        }
      },
      {
        provide: EntityManager,
        useValue: {}
      },
     {
      provide: getRepositoryToken(Listing),
      useValue: {}
    }
    ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    itemRepository= module.get<Repository<Item>>(getRepositoryToken(Item))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all items', async ()=>{
   await service.findAll();

   expect(itemRepository.find).toHaveBeenCalled();
  })
});