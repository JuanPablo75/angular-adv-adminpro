import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit{

  constructor(){}

  ngOnInit(): void {
      
    // const promesa = new Promise( (resolve, reject) => {

    //   if(false){

    //     resolve("Hola mundo desde Promesa");
    //   }else{
    //     reject("Malio sal.")
    //   }
    // });

    // promesa
    //   .then((mensaje) => {
    //     console.log(mensaje)
    //   })
    //   .catch((error) => console.log("Algo salio mal, error: ", error))

    // console.log("Hola mundo fuera de Init");

    this.getUsuarios().then(usuarios => 
      console.log(usuarios)
    )}

  getUsuarios(){

    return new Promise( resolve =>{

      fetch('https://reqres.in/api/users')
        .then( resp => resp.json())
        .then( body => resolve(body.data))
    })

  }

}
