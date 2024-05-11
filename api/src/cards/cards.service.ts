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

  async findAll(type?: string): Promise<Card[]> {
    if (type) {
      return this.cardsRepository.find({ where: { type } });
    }
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

  async simulateBattle(
    attackerId: number,
    defenderId: number,
  ): Promise<{ winner: Card; damage: number }> {
    const attacker = await this.cardsRepository.findOne({
      where: { id: attackerId },
    });
    const defender = await this.cardsRepository.findOne({
      where: { id: defenderId },
    });

    if (!attacker || !defender) {
      throw new Error('Invalid card IDs');
    }

    let damage = attacker.attack;

    if (defender.weakness === attacker.type) {
      damage *= 2;
    } else if (defender.resistance === attacker.type) {
      damage /= 2;
    }

    const winner = damage >= defender.hp ? attacker : defender;

    return { winner, damage };
  }
  async getWeaknessesResistances(
    cardId: number,
  ): Promise<{ weaknesses: Card[]; resistances: Card[] }> {
    const card = await this.cardsRepository.findOne({ where: { id: cardId } });

    if (!card) {
      throw new Error('Invalid card ID');
    }

    const weaknesses = await this.cardsRepository.find({
      where: { type: card.weakness },
    });
    const resistances = await this.cardsRepository.find({
      where: { type: card.resistance },
    });

    return { weaknesses, resistances };
  }
}
