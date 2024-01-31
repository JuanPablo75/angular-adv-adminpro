import { environment } from "src/environments/environment";

const api_url = environment.base_url;

export class Usuario{

    constructor(
        public nombre: string,
        public email: string,
        public password ?:string,
        public google?: boolean,
        public img?: string,
        public uid?: string,
        public role?: string
    ){}

    get imagenUrl(){
        // /upload/usuarios/no-image
        if ( this.img ){
            return `${ api_url}/upload/usuarios/${this.img}`
        } else{
        return `${ api_url}/upload/usuarios/no-image`
        }
    }
}


