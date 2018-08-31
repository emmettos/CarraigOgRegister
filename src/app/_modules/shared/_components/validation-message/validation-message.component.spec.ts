import { FormControl, Validators } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationService } from '../../_services/index';

import { ValidationMessageComponent } from './validation-message.component';


describe('ValidationMessageComponent', () => {
  let component: ValidationMessageComponent;
  let fixture: ComponentFixture<ValidationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ValidationMessageComponent 
      ],
      providers: [
        ValidationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationMessageComponent);
    component = fixture.componentInstance;

    component['control'] = new FormControl('');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display validation message when untouched', () => {
    component['control'].markAsTouched();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#validation-message").style.getPropertyValue('display')).toEqual('none');
  });

  it('should not display validation message', () => {
    component['control'].markAsTouched();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#validation-message").style.getPropertyValue('display')).toEqual('none');
  });

  it('should display validation message', () => {
    component['control'].markAsTouched();
    component['control'].setErrors({ 'required': true });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#validation-message").style.getPropertyValue('display')).toEqual('inline');
  });

  it('should use invalid-feedback class', () => {
    component['control'].markAsTouched();
    component['control'].setErrors({ 'required': true });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#validation-message").style.getPropertyValue('invalid-feedback')).toEqual('');
  });
});
