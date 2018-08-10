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
  });

  it('should create', () => {
    component['control'] = new FormControl('');

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
