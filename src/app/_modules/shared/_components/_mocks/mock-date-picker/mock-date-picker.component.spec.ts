import { 
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange, 
  OnChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ValidationService } from '../../../_services/index';


@Component({
  selector: 'app-date-picker',
  templateUrl: './mock-date-picker.component.html',
})
export class MockDatePickerComponent implements OnInit, OnChanges {
  @Input() 
  parentGroup: FormGroup;

  @Input()
  label: string;
  @Input()
  enabled: boolean;
  @Input()
  minDate: NgbDateStruct;
  @Input()
  maxDate: NgbDateStruct;
  @Input()
  startDate: any;

  @Output() 
  valueChange = new EventEmitter();
  
  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this.parentGroup.addControl('datePickerTextBox', 
      this.formBuilder.control({ value: 'yyyy-MM-dd', disabled: !this.enabled }, [this.validationService.datePickerValidator]));
  
      this.parentGroup.controls['datePickerTextBox'].valueChanges.subscribe(
        formValue => {
          this.valueChange.emit(formValue);
        });    
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
       let changedProp: SimpleChange = changes[propName];
 
       if (changedProp.firstChange) {
         continue;
       }
 
       switch (propName) {
         case 'enabled':
           if (changedProp.currentValue) {
             this.parentGroup.get('datePickerTextBox').enable();
           }
           else {
             this.parentGroup.get('datePickerTextBox').disable();
           }            
           break;
         default:
           break;
       }
     }
   } 
}
