import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'horaFormat'
})
export class HoraFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, formato: string = 'HH:mm'): string {
    if (!value) return '';
    return formatDate(value, formato, 'pt-BR');
  }
}
