import {registerDecorator, ValidationArguments, ValidationOptions,} from 'class-validator';

export function IsTimestamp(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsTimestamp',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions, // {...validationOptions, context: {list}},
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value.length > relatedValue.length
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
