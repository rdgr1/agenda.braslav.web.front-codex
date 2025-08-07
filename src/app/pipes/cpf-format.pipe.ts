import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: true // necessário para usar em components standalone
})
export class CpfFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}
