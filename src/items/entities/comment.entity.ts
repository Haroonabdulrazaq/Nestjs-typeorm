import { Column, Entity, ManyToOne } from "typeorm";
import { Item } from "./item.entity";
import { AbstractEntity } from "../../database/abstract.entity";

@Entity()
export class Comment extends AbstractEntity<Comment> {

@Column()
content: string;

@ManyToOne(()=> Item, (item)=> item.comments)
item: Item
}