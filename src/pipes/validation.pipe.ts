import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.metatype) {
      const obj = plainToClass(metadata.metatype, value);
      const errors = await validate(obj);
      if (errors.length) {
        const messages = errors.map((err) => {
          const constraintsEntries = Object.entries(err.constraints || {});
          const constraintMessages = constraintsEntries.map(
            ([key, value]) => `${key} - ${value}`,
          );
          return `${err.property} - ${constraintMessages.join(', ')}`;
        });
        throw new ValidationException(messages);
      }
      return value;
    }
  }
}
