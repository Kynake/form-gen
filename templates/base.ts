import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'output-form',
    templateUrl: './output.component.html'
})
export class OuputComponent implements OnInit {
    outputForm: FormGroup;
    strongPasswordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})';

    constructor(
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.outputForm = this.fb.group({
            _$FIELDS
        });
    }
}