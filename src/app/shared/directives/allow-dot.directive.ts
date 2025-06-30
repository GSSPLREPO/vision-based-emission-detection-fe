// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appAllowDot]',
//   standalone: true
// })
// export class AllowDotDirective {

//   constructor() { }

//   @HostListener('input', ['$event']) onInputChange(event: any) {
//     event.target.value = event.target.value.replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');
//     event.preventDefault();
//   }

// }
import { Directive, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAllowDot]',
  standalone: true
})
export class AllowDotDirective {

  constructor(@Optional() @Self() private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    // const input = event.target.value;
    // const formattedInput = input
    // // .replace(/[^.\d]/g, '') // Remove any non-numeric and non-dot characters
    // .replace(/^(\d*\.)(\d{0,2}).*/g, '$1$2') // Limit the number of digits after the dot to 2
    // .replace(/[^0-9.]/g, '');
    // const formattedInput = input
    // .replace(/^\d+(\.\d{1,2})?$/g);
    
    // if (input !== formattedInput) {
    //   event.target.value = formattedInput;
    //   if (this.control) {
    //     this.control.control?.setValue(formattedInput);
    //     this.control.control?.updateValueAndValidity();
    //   }
    //   event.preventDefault();
    // }
    const input = event.target.value;
    const formattedInput = input.replace(/[^0-9.]/g, '')  // Remove non-numeric chars
      .match(/^\d+(\.\d{0,2})?/)?.[0] || '';  // Limit to numbers with max 2 decimal places
  

      event.target.value = (formattedInput);
    if (input !== formattedInput) {
      
      if (this.control) {
        this.control.control?.setValue((formattedInput) || null, { emitEvent: false });
        this.control.control?.updateValueAndValidity();
      }
    }
  
  }
}
