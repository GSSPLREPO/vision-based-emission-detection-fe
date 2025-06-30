// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appAlphabetOnly]',
//   standalone: true
// })
// export class AlphabetOnlyDirective {

//   constructor(private el: ElementRef) {}

//   @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
//     const input = this.el.nativeElement as HTMLInputElement;
//     const initialValue = input.value;
//     input.value = initialValue.replace(/[^a-zA-Z]/g, '');
//     if (initialValue !== input.value) {
//       event.stopPropagation();
//     }
//   }

// }
import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphabetOnly]',
  standalone: true
})
export class AlphabetOnlyDirective {

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl
  ) {}

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    const initialValue = input.value;
      // Allow alphabetic characters and spaces
    input.value = initialValue.replace(/[^a-zA-Z\s]/g, '');
    if (initialValue !== input.value) {
      if (this.control) {
        this.control.control?.setValue(input.value);
        this.control.control?.updateValueAndValidity();
      }
      event.stopPropagation();
    }
  }

}
