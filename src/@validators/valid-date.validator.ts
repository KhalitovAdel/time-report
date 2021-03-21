import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ name: 'ValidDate', async: false })
export class ValidDate implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return moment(text, 'DD.MM.YYYY').isValid();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date ($value) should has DD.MM.YYYY format!';
  }
}
