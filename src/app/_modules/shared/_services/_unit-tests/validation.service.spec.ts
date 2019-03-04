import { FormControl } from '@angular/forms';

import { ValidationService } from '../index';
import { ICoachSummary } from '../../../../_models';


describe('ValidationService', () => {
  let service: ValidationService;
  let formControl = new FormControl();

  beforeEach(() => {
    service = new ValidationService();
  });

  it('should validate valid email', () => {
    formControl.setValue('test@gmail.com');

    expect(service.emailValidator(formControl)).toBeNull();
  });

  it('should validate invalid email', () => {
    formControl.setValue('test:gmail.com');

    expect(service.emailValidator(formControl)).toEqual({ 'invalidEmailAddress': true });
  });

  it('should validate valid group year', () => {
    formControl.setValue('2009');

    expect(service.groupValidator(formControl)).toBeNull();
  });

  it('should validate invalid group year', () => {
    formControl.setValue('0');

    expect(service.groupValidator(formControl)).toEqual({ 'selectGroup': true });
  });

  it('should validate valid year of birth', () => {
    formControl.setValue('2009');

    expect(service.yearOfBirthValidator(formControl)).toBeNull();
  });

  it('should validate invalid year of birth', () => {
    formControl.setValue('0');

    expect(service.yearOfBirthValidator(formControl)).toEqual({ 'selectYearOfBirth': true });
  });

  it('should validate valid password match', () => {
    let passwordMatchControl = new FormControl();

    formControl.setValue('Password01');
    passwordMatchControl.setValue('Password01');

    expect(service.passwordMatchValidator(formControl)(passwordMatchControl)).toBeNull();
  });

  it('should validate invalid password match', () => {
    let passwordMatchControl = new FormControl();

    formControl.setValue('Password01');
    passwordMatchControl.setValue('Password02');

    expect(service.passwordMatchValidator(formControl)(passwordMatchControl)).toEqual({ 'invalidConfirmPassword': true });
  });

  it('should validate valid new coach', () => {
    formControl.setValue('test@gmail.com');

    expect(service.newCoachValidator(null)(formControl)).toBeNull();
  });

  it('should validate invalid new coach', () => {
    formControl.setValue('erick_norris@carraigog.com');

    let currentCoaches: ICoachSummary[] = [
      {
        'id': 1,
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 1550344',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      }
    ];  

    expect(service.newCoachValidator(currentCoaches)(formControl)).toEqual({ 'invalidNewCoach': true });
  });

  it('should return invalid email message', () => {
    expect(service.validationMessage('invalidEmailAddress')).toEqual('Invalid email address');
  });

  it('should return invalid password match message', () => {
    expect(service.validationMessage('invalidConfirmPassword')).toEqual('The Confirm Password does not match the Password');
  });

  it('should return invalid required message', () => {
    expect(service.validationMessage('required')).toEqual('This field is required');
  });

  it('should return invalid min length message', () => {
    expect(service.validationMessage('minlength', { requiredLength: 4 })).toEqual('Minimum length 4');
  });

  it('should return invalid new coach message', () => {
    expect(service.validationMessage('invalidNewCoach')).toEqual('A coach with this email address already exists');
  });
});