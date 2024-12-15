import { Component, forwardRef } from '@angular/core';
// import { FormFieldCustomControlExample, MyTelInput } from "../controls/form-field-custom-control-example/form-field-custom-control-example";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MyPhoneComponent } from "../controls/my-phone/my-phone.component";
import { MyTelInput } from '../controls/form-field-custom-control-example/form-field-custom-control-example';
import { MyDdComponent, MyTelDd } from "../controls/my-dd/my-dd.component";

@Component({
  selector: 'app-test-ui',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    forwardRef(() => MyTelInput),
    forwardRef(() => MyPhoneComponent),
    forwardRef(() => MyDdComponent),
    MatIconModule,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './test-ui.component.html',
  styleUrl: './test-ui.component.scss'
})


export class TestUIComponent {
  readonly form = new FormGroup({
    Phone1: new FormControl(null),
    Phone2: new FormControl(null),
    Gender: new FormControl('')
  });

  checkFormValue() {
    var here = this.form.value;

    console.log(this.form.value);
  }
}
