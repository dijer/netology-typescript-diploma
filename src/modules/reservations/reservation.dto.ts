import { IsDateString, IsDefined, IsString } from 'class-validator';

export class ReservationDto {
  @IsString()
  @IsDefined()
  public readonly user: string;

  @IsString()
  @IsDefined()
  public readonly hotel: string;

  @IsString()
  @IsDefined()
  public readonly room: string;

  @IsString()
  @IsDateString()
  public readonly dateStart: string;

  @IsString()
  @IsDateString()
  public readonly dateEnd: string;
}
