import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'

type InputTypes = 'text' | 'name'| 'email' | 'password'
@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
  }],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements ControlValueAccessor{
@Input() label: string = '';
@Input() placeholder: string = '';
@Input() type: InputTypes = 'text';
@Input() inputName: string = '';
@Input() autocomplete: string = '';
@Input() formControl: FormControl = new FormControl();
value: string = '';
onChange: any = () => {}
onTouched: any = () => {}
  onInput (event: Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }
  writeValue(value: any): void {
      this.value = value
  }
  registerOnChange(fn: any): void {
      this.onChange = fn
  }
  registerOnTouched(fn: any): void {
      this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {}
}
