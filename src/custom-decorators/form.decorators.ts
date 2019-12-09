import { Injector } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

/** Set initial constant values */
const generatedVariableName: string = 'generatedForm';
const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.{6,})/
const phoneRegex = /\(\d{2}\) \d{4,5}-\d{4}/

/** Get an instance of FormBuilder without having to inject it in a constructor, given we're not on a Class here */
const formBuilder = Injector.create({ providers: [{ provide: FormBuilder, deps: []}]}).get(FormBuilder);
const supportedInputTypes = {
  text: {
    validators: [Validators.required],
    mask: x => x
  },
  password: {
    validators: [Validators.required, Validators.pattern(strongPasswordRegex)],
    mask: x => x
  },
  email: {
    validators: [Validators.required, Validators.email],
    mask: x => x
  },
  phone: {
    validators: [Validators.required, Validators.pattern(phoneRegex)],
    mask: (phone: string) => {
      let res = phone.replace(/\D/g, '')
      return res.replace(/(\d{1})/, '($1')
        .replace(/(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3');
    }
  }
};

function listSupportedTypes() {
  return Object.keys(supportedInputTypes)
}

/** Initialize empty forms list */
let forms = {};

export function Form(inputType: string, which: string = 'default'): PropertyDecorator {
  return (target: Object, propertyKey: string) => {
    if(inputType === undefined) {
      console.error('Undefined inputType in decorator @Form()');
      return;
    }

    if(supportedInputTypes[inputType] === undefined) {
      console.error(`Unsupported inputType in decorator @Form('${inputType}'). Supported types: ${listSupportedTypes()}`);
      return;
    }

    if(propertyKey === 'form') {
      console.error(`Invalid input name: word \`${propertyKey}\` is reserved for raw form value on \`${generatedVariableName}.form\``);
      return;
    }

    if(propertyKey === 'get') {
      console.error(`Invalid input name: word \`${propertyKey}\` is reserved for get function on \`${generatedVariableName}.get()\``);
      return;
    }

    // Create, if necessary, the form this control should be under
    if(forms[which] === undefined) {
      forms[which] = formBuilder.group({});
    }

    // Include 'property' named control in form
    forms[which].addControl(propertyKey, formBuilder.control(undefined, supportedInputTypes[inputType].validators));

    // Replace property with Getter + Setter, syncing it with it's respective FormControl
    Object.defineProperty(target, propertyKey, {
      get() {
        return forms[which].get(propertyKey).value;
      },
      set(val: any) {
        forms[which].get(propertyKey).setValue(supportedInputTypes[inputType].mask(val));
      }
    });

    // Set value on 'generatedVariableName' propertyKey
    Object.defineProperty(target, which === 'default'? generatedVariableName: `${which}_${generatedVariableName}`, {
      get(): FormGroup { return forms[which]; },
      set(val: any) { console.warn(`Trying to set value of \`${generatedVariableName}\` directly. Attempt will be ignored`); }
    });
  }
}

export function Text(which: string = 'default'): PropertyDecorator { return Form('text', which); }
export function Password(which: string = 'default'): PropertyDecorator { return Form('password', which); }
export function Email(which: string = 'default'): PropertyDecorator { return Form('email', which); }
export function Phone(which: string = 'default'): PropertyDecorator { return Form('phone', which); }
