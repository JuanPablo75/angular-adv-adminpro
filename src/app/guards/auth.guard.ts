import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // console.log('paso con el canActivate del guard');


  return usuarioService.validarToken()
    .pipe(
      tap( estaAutenticado => {
        if (!estaAutenticado ){
          router.navigateByUrl('/login')
        }
      })
    );
};
