import {
  IsNumber,
  IsString,
  Length,
  Min,
  IsUUID,
  IsInt,
  Max,
} from 'class-validator';

export class UpdateBookDTO {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(1000)
  price: number;

  @IsUUID()
  authorId: string;
}
