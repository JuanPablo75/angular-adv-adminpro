import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public formSubmitted = false;

  public loginForm :FormGroup;
  

  constructor(  private fb: FormBuilder,
                private router: Router,
                private usuarioService: UsuarioService) 
                {
                this.loginForm = this.fb.group({
                  email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ]],
                  password: ['', [ Validators.required ]],
                  remember: [false]
                  });
                }
  login(){
    this.usuarioService.login(this.loginForm.value)
        .subscribe( 
          {
            next: resp =>{

              if( this.loginForm.get('remember')!.value){
                localStorage.setItem('email', this.loginForm.get('email')!.value);
              } else{
                localStorage.removeItem( 'email');
              }
              console.log('Usuario logeado.');
              console.log(resp);
              this.router.navigateByUrl('/');
            },
            error: err => {
              console.log(err.error.msg);
              Swal.fire('Error', err.error.msg, 'error');
            }
        })
    // console.log( this.loginForm.value);
   
  }

}
