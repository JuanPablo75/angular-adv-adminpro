// Angular Core y Librerías Externas
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Modelos y Servicios
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  // Propiedades del Componente
  public medicoForm: FormGroup;
  public hospitales: Hospital[];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  // Constructor del Componente con Inyección de Dependencias
  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // Método de Inicialización del Componente
  ngOnInit(): void {
    // Suscribe al cambio en los parámetros de la URL para cargar información del médico
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    // Inicializa el formulario reactivo
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    // Carga la lista de hospitales y suscribe a cambios en el hospital seleccionado
    this.cargarHospitales();

    // Suscribe a cambios en la selección del hospital
    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find((h) => h._id === hospitalId);
    });
  }

  // Método para cargar la información de un médico por su ID
  cargarMedico(id: string) {
    // Verifica si se está creando un nuevo médico
    if (id === 'nuevo') {
      return;
    }

    // Obtiene la información del médico por su ID
    this.medicoService
      .getMedicoById(id)
      .pipe(delay(300))
      .subscribe((res) => {
        // Redirecciona si el médico no existe
        if (!res.medico) {
          return this.router.navigateByUrl(`dashboard/medicos`);
        }

        // Extrae la información del médico y actualiza el formulario
        const { nombre, hospital } = res.medico;
        this.medicoSeleccionado = res.medico;
        this.medicoForm.setValue({ nombre, hospital: hospital._id });
        return true;
      });
  }

  // Método para cargar la lista de hospitales
  cargarHospitales() {
    // Obtiene la lista de hospitales desde el servicio
    this.hospitalService.cargarHospitales().subscribe((resp) => {
      this.hospitales = resp.hospitales;
    });
  }

  // Método para guardar la información de un médico (crear o actualizar)
  guardarMedico() {
    // Extrae el nombre del formulario
    const { nombre } = this.medicoForm.value;

    // Verifica si se está actualizando un médico existente
    if (this.medicoSeleccionado) {
      // Actualiza la información del médico
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };
      this.medicoService.actualizarMedico(data).subscribe(() => {
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      });
    } else {
      // Crea un nuevo médico
      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp: any) => {
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`);
      });
    }
  }
}
