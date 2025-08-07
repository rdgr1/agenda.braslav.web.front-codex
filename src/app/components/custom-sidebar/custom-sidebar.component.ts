import { Component, computed, Input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog'; // <-- adicionado

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  color: string
};

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './custom-sidebar.component.html',
  styleUrls: ['./custom-sidebar.component.scss'],
})
export class CustomSidebarComponent {
  private _sideNavCollapsed = signal(false);
  hoveredItem: MenuItem | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog // <-- necessário para abrir o diálogo
  ) {}

  @Input() set collapsed(value: boolean) {
    this._sideNavCollapsed.set(value);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  get sideNavCollapsed() {
    return this._sideNavCollapsed();
  }

  menuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: '/homepage/dashboard', color: '#2c579f' },
    { icon: 'delivery_dining', label: 'Entregas', route: '/homepage/entregas', color: '#08afef' },
    { icon: 'group', label: 'Clientes', route: '/homepage/clientes', color: '#a35da2' },
    { icon: 'apartment', label: 'Unidades', route: '/homepage/unidades', color: '#c0d73d' },
    { icon: 'person', label: 'Usuários', route: '/homepage/usuarios', color: '#fba730' },
  ]);

  profilePicSize = computed(() => (this.sideNavCollapsed ? '32' : '100'));

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        mensagem: 'Tem certeza que deseja sair do sistema?',
        textoConfirmar: 'Sair'
      },
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
