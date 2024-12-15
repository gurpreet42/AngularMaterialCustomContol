import { FocusMonitor } from '@angular/cdk/a11y';
import { BrowserModule } from '@angular/platform-browser'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';

/** Data structure for holding DD value. */
export class MyTelDd {
  constructor(
    public partsSelectedValue: string,
  ) { }
}

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'app-my-dd',
  templateUrl: './my-dd.component.html',
  styleUrl: './my-dd.component.scss',
  providers: [{ provide: MatFormFieldControl, useExisting: MyDdComponent }],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSelectModule, AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDdComponent implements ControlValueAccessor, MatFormFieldControl<MyTelDd>, OnDestroy {

  static nextId = 0;

  ngControl = inject(NgControl, { optional: true, self: true });
  readonly parts: FormGroup<{
    partsSelectedValue: FormControl<string | null>;
  }>;

  readonly stateChanges = new Subject<void>();
  readonly touched = signal(false);
  readonly controlType = 'example-tel-input';
  readonly id = `example-tel-input-${MyDdComponent.nextId++}`;
  readonly _userAriaDescribedBy = input<string>('', { alias: 'aria-describedby' });
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _value = model<MyTelDd | null>(null, { alias: 'value' });
  onChange = (_: any) => { };
  onTouched = () => { };

  protected readonly _formField = inject(MAT_FORM_FIELD, {
    optional: true,
  });

  private readonly _focused = signal(false);
  private readonly _disabledByCva = signal(false);
  private readonly _disabled = computed(() => this._disabledByInput() || this._disabledByCva());
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  get focused(): boolean {
    return this._focused();
  }

  get empty() {
    const {
      value: { partsSelectedValue },
    } = this.parts;

    return !partsSelectedValue;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get userAriaDescribedBy() {
    return this._userAriaDescribedBy();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get value(): MyTelDd | null {
    return this._value();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched();
  }
  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.parts = inject(FormBuilder).group({
      partsSelectedValue: ['']
    });

    effect(() => {
      // Read signals to trigger effect.
      this._placeholder();
      this._required();
      this._disabled();
      this._focused();
      // Propagate state changes.
      untracked(() => this.stateChanges.next());
    });

    effect(() => {
      if (this._disabled()) {
        untracked(() => this.parts.disable());
      } else {
        untracked(() => this.parts.enable());
      }
    });

    effect(() => {
      const value = this._value() || new MyTelDd('');
      untracked(() => this.parts.setValue(value));
    });

    this.parts.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.stateChanges.next();
    });

    this.parts.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      debugger;
      const tel = this.parts.valid
        ? new MyTelDd(
          this.parts.value.partsSelectedValue || ''
        )
        : null;
      this._updateValue(tel);
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn() {
    if (!this._focused()) {
      this._focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched.set(true);
      this._focused.set(false);
      this.onTouched();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.example-tel-input-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    // if (this.parts.controls.subscriber.valid) {
    //   this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    // } else if (this.parts.controls.exchange.valid) {
    //   this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    // } else if (this.parts.controls.area.valid) {
    //   this._focusMonitor.focusVia(this.exchangeInput(), 'program');
    // } else {
    //   this._focusMonitor.focusVia(this.areaInput(), 'program');
    // }
  }

  writeValue(tel: MyTelDd | null): void {
    this._updateValue(tel);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectionChange() {
    console.log(new MyTelDd(
      this.parts.value.partsSelectedValue || ''
    ));

    this._updateValue(new MyTelDd(
      this.parts.value.partsSelectedValue || ''
    ));
  };

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  private _updateValue(tel: MyTelDd | null) {
    const current = this._value();
    if (
      tel === current ||
      (tel?.partsSelectedValue === current?.partsSelectedValue)
    ) {
      return;
    }
    this._value.set(tel);
  }
}