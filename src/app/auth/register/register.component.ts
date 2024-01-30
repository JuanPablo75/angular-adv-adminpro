import { TmplAstTextAttribute } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Juan Pablo', [ Validators.required ]],
    email: ['alujuanpablo@gmail.com', [ Validators.required, Validators.email ]],
    password: ['123456', [ Validators.required ]],
    confirm_password:  ['123456', [Validators.required]],
    terminos: [ true, [ Validators.required ]],
  },  { 
    validator: this.passwordsIguales('password', 'confirm_password') 
});

  constructor(  private fb: FormBuilder,
                private router : Router,
                private usuarioService: UsuarioService) {}



  crearUsuario(){

    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if ( !this.registerForm.valid ){
      return
    }

    //Realizar posteo
    this.usuarioService.crearUsuario( this.registerForm.value)
    .subscribe( 
      {
        next: resp =>{
          console.log('Usuario creado.');
          console.log(resp);

          this.router.navigateByUrl('/');
        },
        error: err => {
          
          Swal.fire('Error', err.error.msg, 'error');
        }
    })
  }

  campoNoValido(campo: string): boolean{

    if ( this.registerForm.get(campo)!.invalid && this.formSubmitted ) {
      return true;
    }else return false;
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')!.value && this.formSubmitted;
  }

  contrasenasNoValidas(){

    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('confirm_password')!.value;

    if( (pass1 !== pass2) && this.formSubmitted){
      return true
    }else return false;
  }

  passwordsIguales(pass1: string, pass2: string) {

    return ( formGroup: FormGroup) =>{

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control!.value === pass2Control!.value){
        pass2Control!.setErrors(null)
      } else pass2Control!.setErrors({noEsIgual : true})
      
    }

  }
}
