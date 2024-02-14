import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RxjsComponent } from "./rxjs/rxjs.component";

// Guards
// Guard para que solo vean la aplicación si están logueados
import { authGuard } from "../guards/auth.guard";
// Guard para que solo los USER_ADMIN puedan ver la pagina  de usuarios
import { adminGuard } from "../guards/admin.guard";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { PromesasComponent } from "./promesas/promesas.component";
import { PerfilComponent } from "./perfil/perfil.component";

//Mantenimientos Components
import { UsuariosComponent } from "./mantenimientos/usuarios/usuarios.component";
import { HospitalesComponent } from "./mantenimientos/hospitales/hospitales.component";
import { MedicosComponent } from "./mantenimientos/medicos/medicos.component";
import { MedicoComponent } from "./mantenimientos/medicos/medico.component";
import { BusquedaComponent } from "./busqueda/busqueda.component";

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate : [ authGuard ],
        children: [
          { path: '', component: DashboardComponent, data: { titulo:'Dashboard'} },
          {path: 'account-settings', component: AccountSettingsComponent, data: { titulo:'Temas'} },
          {path: 'buscar/:termino', component: BusquedaComponent, data: { titulo:'Busquedas'} },
          { path: 'grafica1', component: Grafica1Component, data: { titulo:'Gráfica #1'} },
          {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'}},
          { path: 'progress', component: ProgressComponent, data: { titulo:'Progress'} },
          {path: 'promesas', component: PromesasComponent, data: { titulo:'Promesas'} },
          {path:'rxjs', component: RxjsComponent, data: { titulo:'Rxjs'} },
          // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

          // Mantenimientos
          {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de Hospitales'}},
          {path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de Médicos'}},
          {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de Médicos'}},
          
          // Rutas de ADMIN
          {path: 'usuarios', canActivate:[ adminGuard ],component: UsuariosComponent, data: {titulo: 'Mantenimiento de Usuarios'}},
        ],
      },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}