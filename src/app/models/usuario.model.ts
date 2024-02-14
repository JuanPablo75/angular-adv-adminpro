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
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    ){}

    get imagenUrl(){
        
        if (!this.img ){
            return `${ api_url}/upload/usuarios/no-image`;
        } 
        else if ( this.img.includes('https')){
            return this.img;
        }
        else if ( this.img ){
            return `${ api_url}/upload/usuarios/${this.img}`
        } 
        else {
        return `${ api_url}/upload/usuarios/no-image`
        }
    }
}


