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
  NotFoundException,
  Logger,
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
  private readonly logger = new Logger(CardsController.name);

  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'The created card', type: Card })
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    this.logger.log(`Creating a new card: ${JSON.stringify(createCardDto)}`);
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
    this.logger.log(`Getting all cards with type: ${type}`);
    return this.cardsService.findAll(type);
  }

  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({ status: 200, description: 'The card', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log(`Getting card by ID: ${id}`);
    try {
      return await this.cardsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'The updated card', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    this.logger.log(`Updating card with ID: ${id}`);
    try {
      return await this.cardsService.update(id, updateCardDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 204, description: 'The card has been deleted' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiParam({ name: 'id', description: 'ID of the card' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    this.logger.log(`Deleting card with ID: ${id}`);
    try {
      await this.cardsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Simulate a battle between two cards' })
  @ApiResponse({ status: 200, description: 'The battle result' })
  @ApiResponse({
    status: 404,
    description: 'Attacker or defender card not found',
  })
  @ApiParam({ name: 'attackerId', description: 'ID of the attacking card' })
  @ApiParam({ name: 'defenderId', description: 'ID of the defending card' })
  @Get(':attackerId/battle/:defenderId')
  async battle(
    @Param('attackerId') attackerId: number,
    @Param('defenderId') defenderId: number,
  ) {
    this.logger.log(
      `Simulating battle between attacker ${attackerId} and defender ${defenderId}`,
    );
    try {
      return await this.cardsService.simulateBattle(attackerId, defenderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Attacker or defender card not found');
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get weaknesses and resistances of a card' })
  @ApiResponse({ status: 200, description: 'The weaknesses and resistances' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiParam({ name: 'cardId', description: 'ID of the card' })
  @Get(':cardId/weaknesses-resistances')
  async getWeaknessesResistances(@Param('cardId') cardId: number) {
    this.logger.log(
      `Getting weaknesses and resistances for card with ID: ${cardId}`,
    );
    try {
      return await this.cardsService.getWeaknessesResistances(cardId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card with ID ${cardId} not found`);
      }
      throw error;
    }
  }
}
