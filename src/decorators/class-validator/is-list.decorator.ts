import {registerDecorator, ValidationArguments, ValidationOptions,} from 'class-validator';

export function IsList(
  list: Array<{ value: string; label?: string; className?: string }>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsList',
      target: object.constructor,
      propertyName: propertyName,
      constraints: list,
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
