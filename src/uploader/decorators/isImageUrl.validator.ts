import { registerDecorator, ValidationOptions } from 'class-validator';
import isImageURL from 'image-url-validator';

export function IsImageUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isImageUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: any): Promise<boolean> {
          return await isImageURL(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be image URL`;
        },
      },
    });
  };
}
