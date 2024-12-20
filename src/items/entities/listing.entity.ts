import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Listing extends AbstractEntity<Listing> {
    @Column()
    description: string;

    @Column({ default: 0 })
    rating: number;
}