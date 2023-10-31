import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: []
})
export class BreadcrumbsComponent  implements OnDestroy{

  public titulo : string|any;
  public tituloSubs$ : Subscription;

  constructor( private router : Router){

    this.tituloSubs$ = this.getArgumentosRuta()  
                              .subscribe(({titulo}) =>{
                                this.titulo = titulo;
                                document.title = `AdminPro - ${titulo}`
                              });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta(){
    return this.router.events
    .pipe(
      filter( (event) : event is ActivationEnd => event instanceof ActivationEnd),
      filter( (event : ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event : ActivationEnd) => event.snapshot.data)
    );
    // .subscribe(data => {
    //     this.titulo = data['titulo']
    //     console.log(this.titulo)
    //   })

  }

}
