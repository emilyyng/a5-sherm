// components/segmented/segmented.component.ts
// pill-style single-choice control that works with Angular forms:
//   <app-segmented formControlName="difficulty" labelledBy="diff-label" [options]="opts" />
import { Component, Input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SegmentedOption {
  value: string | number | boolean;
  label: string;
}

type Value = SegmentedOption['value'];

let nextId = 0;

@Component({
  selector: 'app-segmented',
  standalone: true,
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedComponent),
      multi: true,
    },
  ],
})
export class SegmentedComponent implements ControlValueAccessor {
  @Input({ required: true }) options: SegmentedOption[] = [];
  /** id of the visible label element, for screen readers */
  @Input() labelledBy = '';

  readonly name = `segmented-${nextId++}`;   // groups the radios so arrow keys work
  readonly selected = signal<Value | null>(null);
  readonly disabled = signal(false);

  private onChange: (v: Value) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: Value | null) { this.selected.set(v); }
  registerOnChange(fn: (v: Value) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled.set(isDisabled); }

  select(v: Value) {
    this.selected.set(v);
    this.onChange(v);
    this.onTouched();
  }
}