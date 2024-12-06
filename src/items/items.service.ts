import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(Listing)
    private readonly ListingRepository: Repository<Listing>,
  ){}
 async create(createItemDto: CreateItemDto) {
  const listing = new Listing({
    ...createItemDto.listing,
    rating: 0
  });
  const tags = createItemDto.tags.map(tag => ((
    new Tag(tag)
  )))
  const items = new Item({
    ...createItemDto,
    listing,
    comments: [],
    tags
  })
  const newItem = this.itemsRepository.create(items);
    const data =  await this.itemsRepository.save(newItem);
    return {
      data,
      message: "Item created successfully!"
    }
  }

  async findAll() {
    return await this.itemsRepository.find(
      {relations: {listing: true, comments: true, tags: true}}
    );
  }

  async findOne(id: number) {
    return await this.itemsRepository.findOne(
      { where:{ "id": id },
      relations: {listing: true, comments: true, tags: true}
    }
    );
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return await this.itemsRepository.manager.transaction(async(transactionManager) => {
      const item = await transactionManager.findOne(this.itemsRepository.target, {
        where: {id},
        relations: {comments: true}
      });
      if(!item){
        throw new NotFoundException();
      }

      item.public = updateItemDto.public;
      item.name = updateItemDto.name


      if (item.comments && item.comments.length > 0) {
        console.log('Im in comments');
        await transactionManager.remove(item.comments);
      }

      const comments = updateItemDto.comments.map(comment=> (
        transactionManager.create(Comment, comment)
      ))
      item.comments = comments;

      if (item.tags && item.tags.length > 0) {
        console.log('Im in tags');
        
        await transactionManager.remove(item.tags);
      }
      const tags = updateItemDto.tags.map(tag => ((
        transactionManager.create(Tag, tag)
      )))
      item.tags = tags;

      const updatedItem = await transactionManager.save(item);
  
      return {
        updatedItem,
        message: "Item updated successfully!"
      }

    });
  }

 async remove(id: number) {
    const removedItem = await this.itemsRepository.delete(id);

    if (removedItem.affected === 0) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return {
      message: `item ${id} is deleted successfully!`
    }
  }
}
