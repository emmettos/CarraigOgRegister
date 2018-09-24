import { FormControl } from '@angular/forms';

import { ValidationService } from '../index';


describe('ValidationService', () => {
  let service: ValidationService;
  let formControl = new FormControl();

  beforeEach(() => {
    service = new ValidationService();
  });

  it('should validate valid date picker', () => {
    formControl.setValue('2018-08-31');

    expect(service.datePickerValidator(formControl)).toBeNull();
  });

  it('should validate invalid date picker', () => {
    formControl.setValue('yyyy-MM-dd');

    expect(service.datePickerValidator(formControl)).toEqual({ 'invalidDatePicker': true });
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

    expect(service.groupYearValidator(formControl)).toBeNull();
  });

  it('should validate invalid group year', () => {
    formControl.setValue('Select Year');

    expect(service.groupYearValidator(formControl)).toEqual({ 'invalidGroupYear': true });
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

  it('should return invalid email message', () => {
    expect(service.validationMessage('invalidEmailAddress')).toEqual('Invalid email address');
  });

  it('should return invalid password match message', () => {
    expect(service.validationMessage('invalidConfirmPassword')).toEqual('The new passwords do not match');
  });

  it('should return invalid required message', () => {
    expect(service.validationMessage('required')).toEqual('This field is required');
  });

  it('should return invalid min length message', () => {
    expect(service.validationMessage('minlength', { requiredLength: 4 })).toEqual('Minimum length 4');
  });
});