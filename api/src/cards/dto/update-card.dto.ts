// update-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  hp?: number;
  @ApiProperty()
  attack?: number;
  @ApiProperty()
  weakness?: string;
  @ApiProperty()
  resistance?: string;
}
