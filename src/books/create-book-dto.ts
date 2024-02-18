import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
