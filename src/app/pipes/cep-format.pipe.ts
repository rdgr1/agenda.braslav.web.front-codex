import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cepFormat',
  standalone: true  
})
export class CepFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';


    const digits = value.replace(/\D/g, '');

    if (digits.length <= 5) {
      return digits;
    }

    return digits.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
  }
}
