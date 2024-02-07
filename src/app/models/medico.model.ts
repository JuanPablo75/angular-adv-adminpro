import { Hospital } from "./hospital.model";

interface _medicoUser{
    _id: string;
    nombre: string;
    img: string;
}
export class Medico {

    constructor (
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _medicoUser,
        public hospital?: Hospital
    ) {}

}