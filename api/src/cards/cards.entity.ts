// card.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  hp: number;

  @Column()
  attack: number;

  @Column()
  weakness: string;

  @Column()
  resistance: string;
}
