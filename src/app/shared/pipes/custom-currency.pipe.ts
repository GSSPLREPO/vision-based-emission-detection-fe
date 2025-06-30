import { Pipe, PipeTransform } from '@angular/core';
import { global_const } from '../../../config/global-constants';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number): string | null {
    if (value == null) {
      return null;
    }


    // const formatted = new Intl.NumberFormat('en-IN', {
    //   style: 'currency',
    //   currency: currencyCode,
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // }).format(value);

    const formatted = value.toLocaleString(global_const.currencyType, {style:"currency", currency:global_const.currencySymbol, minimumFractionDigits: 0,})
    // const formatted = value.toLocaleString(global_const.currencyType)
    return formatted;
  }

}
