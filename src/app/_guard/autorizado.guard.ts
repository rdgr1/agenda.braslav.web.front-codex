import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const autorizadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const token = authService.getToken();

  if (token) {
    return true; // Usuário autenticado, acesso permitido
  } else {
    router.navigate(['/login']); // Redireciona para login
    return false; // Bloqueia o acesso
  }
};
