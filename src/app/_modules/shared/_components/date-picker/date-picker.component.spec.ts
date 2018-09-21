import { SimpleChange } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ValidationService } from '../../_services';

import { DatePickerComponent } from './date-picker.component';


describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DatePickerComponent 
      ],
      imports: [
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        ValidationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;

    component['parentGroup'] = new FormGroup({
      control: new FormControl()
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize date picker field', () => {
    expect(component.parentGroup.controls['datePickerTextBox'].value).toEqual('yyyy-MM-dd');
  });

  it('should validate invalid date picker field', () => {
    component.ngOnChanges({
      enabled: new SimpleChange(null, true, false)
    });

    fixture.detectChanges();
    
    expect(component.parentGroup.controls['datePickerTextBox'].invalid).toBeTruthy();
  });

  it('should validate valid date picker field', () => {
    component.ngOnChanges({
      enabled: new SimpleChange(null, true, false)
    });

    component.parentGroup.controls['datePickerTextBox'].patchValue({
      day: 20,
      month: 9,
      year: 2018
    });

    fixture.detectChanges();
    
    expect(component.parentGroup.controls['datePickerTextBox'].invalid).toBeFalsy();
  });

  it('should hide label field', () => {
    component['label'] = 'Test Label';

    fixture.detectChanges();

    component['label'] = '';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')).toBeNull();  
  });

  it('should display label field', () => {
    component['label'] = 'Test Label';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label').innerHTML).toEqual('Test Label');  
  });

  it('should disable date picker field', () => {
    component.ngOnChanges({
      enabled: new SimpleChange(null, false, false)
    });

    expect(component.parentGroup.controls['datePickerTextBox'].enabled).toBeFalsy();
  });

  it('should enable date picker field', () => {
    component.ngOnChanges({
      enabled: new SimpleChange(null, true, false)
    });
 
    expect(component.parentGroup.controls['datePickerTextBox'].enabled).toBeTruthy();
  });

  it('should set min date field', () => {
    component.ngOnChanges({
      minDate: new SimpleChange(null, { year: 2018, month: 9, day: 21 }, false)
    });

    expect(component.datePicker.minDate).toEqual({ year: 2018, month: 9, day: 21 });
  });

  it('should set max date field', () => {
    component.ngOnChanges({
      maxDate: new SimpleChange(null, { year: 2018, month: 10, day: 22 }, false)
    });

    expect(component.datePicker.maxDate).toEqual({ year: 2018, month: 10, day: 22 });
  });

  it('should set start date field', () => {
    component.ngOnChanges({
      startDate: new SimpleChange(null, { year: 2018, month: 11, day: 19 }, false)
    });

    expect(component.datePicker.startDate).toEqual({ year: 2018, month: 11, day: 19 });
  });
});
