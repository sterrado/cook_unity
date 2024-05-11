// cards.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './cards.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const card = new Card();
    Object.assign(card, createCardDto);
    return this.cardsRepository.save(card);
  }

  async findAll(): Promise<Card[]> {
    return this.cardsRepository.find();
  }

  async findOne(id: number): Promise<Card> {
    return this.cardsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    await this.cardsRepository.update(id, updateCardDto);
    return this.cardsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.cardsRepository.delete(id);
  }

  // Implement card battle simulation and weakness/resistance logic here
}