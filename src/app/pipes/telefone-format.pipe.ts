import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefoneFormat',
  standalone: true
})
export class TelefoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const tel = value.replace(/\D/g, '');
    if (tel.length === 11) {
      return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
    } else if (tel.length === 10) {
      return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
    }
    return value;
  }
}
