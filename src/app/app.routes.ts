import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ClientePageComponent } from './pages/cliente-page/cliente-page.component';
import { EntregaPageComponent } from './pages/entrega-page/entrega-page.component';
import { UnidadePageComponent } from './pages/unidade-page/unidade-page.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { autorizadoGuard } from './_guard/autorizado.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [autorizadoGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'clientes', component: ClientePageComponent },
      { path: 'entregas', component: EntregaPageComponent },
      { path: 'unidades', component: UnidadePageComponent },
      { path: 'usuarios', component: UsuarioPageComponent },
      { path: 'dashboard', component: DashboardPageComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
