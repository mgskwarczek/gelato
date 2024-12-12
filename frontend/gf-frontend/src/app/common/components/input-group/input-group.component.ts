import { Component, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputGroupComponent,
      multi: true,
    },
  ],
})
export class InputGroupComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() inputId: string = '';
  @Input() name: string = '';

  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
