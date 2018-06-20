import { 
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { 
  NgbDatepicker, 
  NgbInputDatepicker, 
  NgbDatepickerConfig, 
  NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { ValidationService } from '../../_services/index';


@Component({
  host: {
    '(document:click)': 'onClick($event)'
  },
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    NgbDatepickerConfig
  ]
})
export class DatePickerComponent implements OnInit {
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

  @ViewChild('datePicker') 
  datePicker: NgbDatepicker;

  @Output() 
  valueChange = new EventEmitter();
  
  private inputDatePicker: NgbInputDatepicker;

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private datePickerConfig: NgbDatepickerConfig,
    private eRef: ElementRef) {
  }

  ngOnInit() {
    this.parentGroup.addControl('datePickerTextBox', 
      this.formBuilder.control({ value: 'yyyy-MM-dd', disabled: !this.enabled }, 
        [this.validationService.dateOfBirthValidator]));

    this.parentGroup.controls['datePickerTextBox'].valueChanges.subscribe(
      formValue => {
        this.datePicker.startDate = null;

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
        case 'minDate':
          this.datePicker.minDate = changedProp.currentValue;
          break;
        case 'maxDate':
          this.datePicker.maxDate = changedProp.currentValue;
          break;
        case 'startDate':
          this.datePicker.startDate = changedProp.currentValue;
          break;
        default:
          break;
      }
    }
  }

  onClickDatePicker(inputDatePicker: NgbInputDatepicker) {
    this.inputDatePicker = inputDatePicker;
  }

  onClick(event: any) {
    if (this.eRef.nativeElement.querySelector('#datePicker').contains(event.target)
        || this.eRef.nativeElement.querySelector('.input-group-append').contains(event.target)
        || this.eRef.nativeElement.querySelector('.fa.fa-calendar').contains(event.target)) {
      return;
    }
      
    if (this.inputDatePicker && this.inputDatePicker.isOpen()) {
      let datePickerCRef: ComponentRef<NgbDatepicker> = (this.inputDatePicker as any)._cRef;

      if (datePickerCRef.location.nativeElement.contains(event.target)) {
        return;
      }
        
      let self = this;
      setTimeout(
        () => {
          self.inputDatePicker.close();
          this.inputDatePicker = null;
        }, 10);
    }
  }
}
