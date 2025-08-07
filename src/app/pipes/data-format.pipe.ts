import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dataFormat'
})
export class DataFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, formato: string = 'dd/MM/yyyy'): string {
    if (!value) return '';
    return formatDate(value, formato, 'pt-BR');
  }
}
