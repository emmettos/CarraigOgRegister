import { 
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
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
  parentForm: FormGroup;

  @Input()
  minDate: NgbDateStruct;
  @Input()
  maxDate: NgbDateStruct;
  @Input()
  startDate: any;

  @Input()
  resetDate: boolean;

  @Input()
  enabled: boolean;

  @ViewChild('datePicker') 
  datePicker: NgbDatepicker;

  private inputDatePicker: NgbInputDatepicker;

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private datePickerConfig: NgbDatepickerConfig,
    private eRef: ElementRef) {
  }

  ngOnInit() {
    this.parentForm.addControl('datePickerTextBox', this.formBuilder.control({value: 'yyyy-MM-dd', disabled: !this.enabled}, this.validationService.dateOfBirthValidator));
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      let changedProp = changes[propName];

      switch (propName) {
        case 'resetDate':
          if (this.parentForm.get('datePickerTextBox')) {
            this.parentForm.get('datePickerTextBox').setValue('yyyy-MM-dd');
          }
          break;
        case 'minDate':
          this.datePickerConfig.minDate = this.minDate;
          break;
        case 'maxDate':
          this.datePickerConfig.maxDate = this.maxDate;
          break;
        case 'startDate':
          this.datePicker.startDate = this.startDate;
          break;
        case 'enabled':
          if (this.parentForm.get('datePickerTextBox')) {
            if (this.enabled) {
              this.parentForm.get('datePickerTextBox').enable();
            }
            else {
              this.parentForm.get('datePickerTextBox').disable();
            }
          }
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
