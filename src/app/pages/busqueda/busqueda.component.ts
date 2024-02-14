import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: []
})
export class BusquedaComponent implements OnInit{

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];

  constructor( private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService){}

  ngOnInit(): void {
      this.activatedRoute.params
          .subscribe( ({ termino }) => {
            this.busquedaGlobal(termino);
          });
  }

  busquedaGlobal( termino: string){

    this.busquedaService.busquedaGlobal( termino )
        .subscribe( (resp: any) => {
          console.log(resp);
          this.usuarios   = resp.usuarios;
          this.hospitales = resp.hospitales;
          this.medicos    = resp.medicos;
        })
  }

}
