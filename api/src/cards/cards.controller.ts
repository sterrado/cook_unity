// cards.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './cards.entity';

@ApiTags('cards')
@Controller('cards')
// @UseGuards(AuthGuard('jwt'))
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'The created card', type: Card })
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @ApiOperation({ summary: 'Get all cards with filtering' })
  @ApiResponse({
    status: 200,
    description: 'The list of filtered cards',
    type: [Card],
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter cards by type',
  })
  @Get()
  async findAll(@Query('type') type?: string) {
    return this.cardsService.findAll(type);
  }

  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({ status: 200, description: 'The card', type: Card })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.cardsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'The updated card', type: Card })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 204, description: 'The card has been deleted' })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.cardsService.remove(id);
  }

  @ApiOperation({ summary: 'Simulate a battle between two cards' })
  @ApiResponse({ status: 200, description: 'The battle result' })
  @ApiParam({ name: 'attackerId', description: 'ID of the attacking card' })
  @ApiParam({ name: 'defenderId', description: 'ID of the defending card' })
  @Get(':attackerId/battle/:defenderId')
  async battle(
    @Param('attackerId') attackerId: number,
    @Param('defenderId') defenderId: number,
  ) {
    return this.cardsService.simulateBattle(attackerId, defenderId);
  }

  @ApiOperation({ summary: 'Get weaknesses and resistances of a card' })
  @ApiResponse({ status: 200, description: 'The weaknesses and resistances' })
  @ApiParam({ name: 'cardId', description: 'ID of the card' })
  @Get(':cardId/weaknesses-resistances')
  async getWeaknessesResistances(@Param('cardId') cardId: number) {
    return this.cardsService.getWeaknessesResistances(cardId);
  }
}
