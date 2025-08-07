import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  styleUrl: './button.component.scss',
  template: `
    <button type="submit" class="custom-btn" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
@Input() disabled: boolean = false;
@Input() texto: string = '';
}
