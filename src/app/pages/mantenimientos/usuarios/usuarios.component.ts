import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: []
})
export class UsuariosComponent implements OnDestroy{

  @ViewChild('txtTermino') inputBusqueda!: ElementRef;

  public totalUsuarios: number = 0;
  public totalUsuariosB: number = 0;

  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  
  public desde: number = 0;
  public desdeB: number = 0;
  
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor( private usuarioService: UsuarioService,
                private busquedasService: BusquedasService,
                private modalImagenService: ModalImagenService){}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void{
    this.cargarUsuarios();



    this.imgSubs = this.modalImagenService.imagenCambiada
            .pipe( delay(100) )
            .subscribe( img => this.cargarUsuarios() )
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({ total, usuarios})=>{
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina( valor: number){
    this.desde += valor;

    if ( this.desde < 0 ){
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ){
      this.desde -= valor;
    }
    
    this.cargarUsuarios();
  }

  cambiarPaginaBuscar( valor : number){
    this.desdeB += valor;

    if ( this.desdeB < 0 ){
      this.desdeB = 0;
    } else if ( this.desdeB >= this.totalUsuarios ){
      this.desdeB -= valor;
    }

    this.buscar(this.inputBusqueda.nativeElement.value)
  }

  buscar( termino: string){

    if ( termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    return this.busquedasService.buscar('usuarios', termino, this.desdeB)
      .subscribe( (resultados) => {

        this.usuarios = resultados;
      });

  }

  eliminarUsuario( usuario: Usuario){

    if ( usuario.uid === this.usuarioService.usuario.uid){
      return Swal.fire('Error', 'No puede borrar su propio usuario desde aquí')
    }

    return Swal.fire({
      title: "¿Borrar usuario?",
      text: `Está a punto de borrar a ${ usuario.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
            .subscribe ( resp => {
              this.cargarUsuarios();
              Swal.fire(
                'Usuario borrado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
                );
              console.log(resp);}
              );
      }
    });
  }

  cambiarRole( usuario: Usuario){

    this.usuarioService.guardarUsuario( usuario)
    .subscribe( resp =>{
      console.log(resp)
    } );
  }

  abrirModal( usuario: Usuario){

    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
