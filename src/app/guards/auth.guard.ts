// Angular Core y Librerías Externas
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

// Definición de la función de canActivate
export const authGuard: CanActivateFn = (route, state) => {

  // Obtención de instancias de servicios y del router mediante la inyección de dependencias
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // Validación del token del usuario a través del servicio
  return usuarioService.validarToken()
    .pipe(
      // Uso de tap para realizar acciones secundarias
      tap(estaAutenticado => {
        // Redirección a la página de inicio de sesión si el usuario no está autenticado
        if (!estaAutenticado) {
          router.navigateByUrl('/login');
        }
      })
    );
};
