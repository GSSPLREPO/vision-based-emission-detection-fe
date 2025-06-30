// import { Directive, HostListener, ElementRef, Input, OnInit } from '@angular/core';

// @Directive({
//   selector: '[appOnlyNumber]',
//   standalone: true
// })
// export class OnlyNumberDirective {

//   private regex: RegExp = new RegExp(/^[0-9]*$/);
//   private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

//   constructor() { }

//   @HostListener('keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent) {
//     // Allow special keys
//     if (this.specialKeys.indexOf(event.key) !== -1) {
//       return;
//     }

//     // Prevent non-numeric keys
//     const current: string = event.key;
//     if (!this.regex.test(current)) {
//       event.preventDefault();
//     }
//   }
// }
import { Directive, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true
})
export class OnlyNumberDirective {

  private regex: RegExp = new RegExp(/^[0-9]*$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(@Optional() @Self() private control: NgControl) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Prevent non-numeric keys
    if (!this.regex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target.value;
    const numericInput = input.replace(/[^0-9]/g, '');

    if (input !== numericInput) {
      event.target.value = numericInput;
      if (this.control) {
        this.control.control?.setValue(numericInput);
        this.control.control?.updateValueAndValidity();
      }
      event.preventDefault();
    }
  }
}
