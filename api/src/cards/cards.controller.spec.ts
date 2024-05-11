// cards.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './cards.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            simulateBattle: jest.fn(),
            getWeaknessesResistances: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Pikachu',
        type: 'Electric',
        hp: 60,
        attack: 40,
        weakness: 'Ground',
        resistance: 'Flying',
      };
      const createdCard: Card = {
        id: 1,
        ...createCardDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdCard);

      const result = await controller.create(createCardDto);

      expect(service.create).toHaveBeenCalledWith(createCardDto);
      expect(result).toEqual(createdCard);
    });
  });

  describe('findAll', () => {
    it('should return an array of cards', async () => {
      const cards: Card[] = [
        {
          id: 1,
          name: 'Pikachu',
          type: 'Electric',
          hp: 60,
          attack: 40,
          weakness: 'Ground',
          resistance: 'Flying',
        },
        {
          id: 2,
          name: 'Charizard',
          type: 'Fire',
          hp: 120,
          attack: 80,
          weakness: 'Water',
          resistance: 'Grass',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(cards);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(cards);
    });

    it('should return an array of cards filtered by type', async () => {
      const type = 'Electric';
      const cards: Card[] = [
        {
          id: 1,
          name: 'Pikachu',
          type: 'Electric',
          hp: 60,
          attack: 40,
          weakness: 'Ground',
          resistance: 'Flying',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(cards);

      const result = await controller.findAll(type);

      expect(service.findAll).toHaveBeenCalledWith(type);
      expect(result).toEqual(cards);
    });
  });

  describe('findOne', () => {
    it('should return a card by ID', async () => {
      const cardId = 1;
      const card: Card = {
        id: cardId,
        name: 'Pikachu',
        type: 'Electric',
        hp: 60,
        attack: 40,
        weakness: 'Ground',
        resistance: 'Flying',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(card);

      const result = await controller.findOne(cardId);

      expect(service.findOne).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(card);
    });

    it('should throw a NotFoundException when card is not found', async () => {
      const cardId = 1;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(cardId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      const cardId = 1;
      const updateCardDto: UpdateCardDto = { hp: 70 };
      const updatedCard: Card = {
        id: cardId,
        name: 'Pikachu',
        type: 'Electric',
        hp: 70,
        attack: 40,
        weakness: 'Ground',
        resistance: 'Flying',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCard);

      const result = await controller.update(cardId, updateCardDto);

      expect(service.update).toHaveBeenCalledWith(cardId, updateCardDto);
      expect(result).toEqual(updatedCard);
    });

    it('should throw a NotFoundException when card is not found', async () => {
      const cardId = 1;
      const updateCardDto: UpdateCardDto = { hp: 70 };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(cardId, updateCardDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a card', async () => {
      const cardId = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(cardId);

      expect(service.remove).toHaveBeenCalledWith(cardId);
    });

    it('should throw a NotFoundException when card is not found', async () => {
      const cardId = 1;

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(cardId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('battle', () => {
    it('should simulate a battle between two cards', async () => {
      const attackerId = 1;
      const defenderId = 2;
      const battleResult = {
        winner: {
          id: 1,
          name: 'Pikachu',
          type: 'Electric',
          hp: 60,
          attack: 40,
          weakness: 'Ground',
          resistance: 'Flying',
        },
        damage: 40,
      };

      jest.spyOn(service, 'simulateBattle').mockResolvedValue(battleResult);

      const result = await controller.battle(attackerId, defenderId);

      expect(service.simulateBattle).toHaveBeenCalledWith(
        attackerId,
        defenderId,
      );
      expect(result).toEqual(battleResult);
    });

    it('should throw a NotFoundException when attacker or defender card is not found', async () => {
      const attackerId = 1;
      const defenderId = 2;

      jest
        .spyOn(service, 'simulateBattle')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.battle(attackerId, defenderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getWeaknessesResistances', () => {
    it('should get weaknesses and resistances of a card', async () => {
      const cardId = 1;
      const weaknessesResistances = {
        weaknesses: [
          {
            id: 2,
            name: 'Onix',
            type: 'Rock',
            hp: 100,
            attack: 60,
            weakness: 'Water',
            resistance: 'Electric',
          },
        ],
        resistances: [
          {
            id: 3,
            name: 'Scizor',
            type: 'Bug',
            hp: 120,
            attack: 90,
            weakness: 'Fire',
            resistance: 'Grass',
          },
        ],
      };

      jest
        .spyOn(service, 'getWeaknessesResistances')
        .mockResolvedValue(weaknessesResistances);

      const result = await controller.getWeaknessesResistances(cardId);

      expect(service.getWeaknessesResistances).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(weaknessesResistances);
    });

    it('should throw a NotFoundException when card is not found', async () => {
      const cardId = 1;

      jest
        .spyOn(service, 'getWeaknessesResistances')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getWeaknessesResistances(cardId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
