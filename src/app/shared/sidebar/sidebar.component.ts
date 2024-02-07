import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent {

  public menuItems : any[] = []

  public usuario: Usuario;

  constructor(public sideBarService: SidebarService,
              private usuarioService: UsuarioService) {
                this.usuario = this.usuarioService.usuario;
              }
  
}
