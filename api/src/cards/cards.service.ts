// cards.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './cards.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const card = new Card();
    Object.assign(card, createCardDto);
    this.logger.log(`Creating card: ${JSON.stringify(card)}`);
    return this.cardsRepository.save(card);
  }

  async findAll(type?: string): Promise<Card[]> {
    if (type) {
      this.logger.log(`Finding cards with type: ${type}`);
      return this.cardsRepository.find({ where: { type } });
    }
    this.logger.log('Finding all cards');
    return this.cardsRepository.find();
  }

  async findOne(id: number): Promise<Card> {
    this.logger.log(`Finding card with id: ${id}`);
    const card = await this.cardsRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    this.logger.log(`Updating card with id: ${id}`);
    const card = await this.findOne(id);
    Object.assign(card, updateCardDto);
    await this.cardsRepository.save(card);
    return card;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing card with id: ${id}`);
    const result = await this.cardsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Card with id ${id} not found`);
    }
  }

  async simulateBattle(
    attackerId: number,
    defenderId: number,
  ): Promise<{ winner: Card; damage: number }> {
    this.logger.log(
      `Simulating battle between attacker ${attackerId} and defender ${defenderId}`,
    );
    const attacker = await this.findOne(attackerId);
    const defender = await this.findOne(defenderId);

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
    this.logger.log(
      `Getting weaknesses and resistances for card with id: ${cardId}`,
    );
    const card = await this.findOne(cardId);

    const weaknesses = await this.cardsRepository.find({
      where: { type: card.weakness },
    });
    const resistances = await this.cardsRepository.find({
      where: { type: card.resistance },
    });

    return { weaknesses, resistances };
  }
}
