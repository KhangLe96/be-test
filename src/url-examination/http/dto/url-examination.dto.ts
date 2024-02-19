import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UrlExaminationDto {
    @ApiProperty({ required: false })
    @IsNumber(undefined, { message: 'The $property must be an integer' })
    @IsOptional()
    @Transform(({ value }) => {
        if (value && Number.isInteger(Number(value))) {
            return Number(value);
        }

        return value;
    })
    priority?: number;
}
