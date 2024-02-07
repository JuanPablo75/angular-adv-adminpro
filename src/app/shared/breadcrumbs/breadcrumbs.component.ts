import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

/**
 * Componente para mostrar migas de pan (breadcrumbs) en la interfaz de usuario.
 */
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: []
})
export class BreadcrumbsComponent implements OnDestroy {

  /** Título de la página o ruta actual. */
  public titulo: string | any;
  
  /** Suscripción para gestionar la actualización del título. */
  public tituloSubs$: Subscription;

  /**
   * Constructor del componente BreadcrumbsComponent.
   * @param router - Instancia del servicio Router para la gestión de rutas.
   */
  constructor(private router: Router) {
    // Inicializa la suscripción al título de la página
    this.tituloSubs$ = this.getArgumentosRuta()
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `AdminPro - ${titulo}`;
      });
  }

  /** Se ejecuta al destruir el componente para liberar recursos. */
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  /**
   * Obtiene los argumentos de la ruta actual.
   * @returns Observable que emite los datos de la ruta actual.
   */
  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      );
  }

}
