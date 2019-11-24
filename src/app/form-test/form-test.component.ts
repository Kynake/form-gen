import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Text, Password, Email, Phone } from '../../custom-decorators/form.decorators';

@Component({
  selector: 'app-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.css']
})
export class FormTestComponent {

  //Placeholder
  generatedForm: FormGroup;

  @Text() name: string = 'hello';
  @Password() pass: string = 'world';
  @Email() email: string = ''
  @Phone() phone: string = '';

  submitForm() {
    console.log(this.generatedForm.value);
  }

  setVal() {
    this.phone = 'abc'
  }

  testFunc() {
    console.log(this.generatedForm);
    console.log(this.generatedForm.value);
  }

}