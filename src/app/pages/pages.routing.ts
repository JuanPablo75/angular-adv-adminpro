import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanMatchFn } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { authGuard, canMatch } from "../guards/auth.guard";

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate : [ authGuard ],
        canMatch: [ canMatch ],
        loadChildren: () => import ('./child-routes.module').then( m => m.ChildRoutesModule),
      },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}