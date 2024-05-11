// cards.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  async findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.cardsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.cardsService.remove(id);
  }

  @Get(':attackerId/battle/:defenderId')
  async battle(
    @Param('attackerId') attackerId: number,
    @Param('defenderId') defenderId: number,
  ) {
    return this.cardsService.simulateBattle(attackerId, defenderId);
  }
  @Get(':cardId/weaknesses-resistances')
  async getWeaknessesResistances(@Param('cardId') cardId: number) {
    return this.cardsService.getWeaknessesResistances(cardId);
  }
}
