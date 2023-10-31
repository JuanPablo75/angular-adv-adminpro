import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval} from 'rxjs';
import { take, retry, map, filter } from 'rxjs/operators'

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs : Subscription;

  constructor(){

    

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log("Subscripcion : ", valor),
    //   error => console.warn("Error : " , error),
    //   () => console.info("Obs terminado.")
    // )

    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);

  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{

    return interval(100)
                      .pipe(
                        // take(10),
                        map(valor => valor + 1),
                        filter(valor => (valor % 2 !== 0) ? true : false)
                        );

  }


  retornaObservable() : Observable<number>{
    let i = 0;
    
    return new Observable<number>( observer =>{
      

      const intervalo = setInterval(()=>{

        i++

        observer.next(i);

        if (i === 4){
          clearInterval(intervalo);
          observer.complete();
        }

        if(i === 2){
          i = 0;
          observer.error('i llegó a 2');
        }
      },1000)

    });

  }
}
