import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusInvalidInput]',
  standalone: true
})
export class FocusInvalidInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    const ngSelectControl = this.el.nativeElement.querySelector('.ng-select-container');

    console.log(ngSelectControl,"as");
    

    if (ngSelectControl) {
      ngSelectControl.focus();
    }
    if (invalidControl) {
      invalidControl.focus();
    }
  }
}
