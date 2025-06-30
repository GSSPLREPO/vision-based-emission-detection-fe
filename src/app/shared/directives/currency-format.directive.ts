import { Directive, ElementRef, HostListener } from '@angular/core';
import { global_const } from '../../../config/global-constants';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true
})
export class CurrencyFormatDirective {

  // private el: HTMLInputElement;

  // constructor(private elementRef: ElementRef) {
  //   this.el = this.elementRef.nativeElement;
  // }

  // @HostListener('input', ['$event'])
  // onInputChange(event: Event): void {
  //   // Get the current value without formatting
  //   let value = this.el.value.replace(/₹|,/g, '');

  //   // If the value is numeric, format it
  //   if (!isNaN(Number(value)) && value) {
  //     this.el.value = this.formatCurrency(value);
  //   }
  // }

  // // Helper function to format the number as currency
  // private formatCurrency(value: string): string {
  //   const numberValue = parseFloat(value);
  //   let val = new Intl.NumberFormat('en-IN').format(numberValue);
  //   return val
  // }

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target.value;
    if(input){
      const numericValue = parseFloat(input.replace(/,/g, ''));
      let val:any = numericValue.toLocaleString(global_const.currencyType);
      event.target.value = val
    }else{
      event.target.value = null
    }
  }

}
