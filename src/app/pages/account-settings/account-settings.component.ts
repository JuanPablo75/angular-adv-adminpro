// Angular Core y Librerías Externas
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ["./account-settings.component.css"]
})
export class AccountSettingsComponent implements OnInit {
  
  // Constructor con inyección de dependencias del servicio de configuración
  constructor(private settingService: SettingService) {}

  // Método de inicialización del componente
  ngOnInit(): void {
    // Verifica y aplica el tema actual al iniciar el componente
    this.settingService.checkCurrentTheme();
  }

  // Método para cambiar el tema de la aplicación
  changeTheme(theme: string): void {
    // Llama al servicio de configuración para cambiar el tema
    this.settingService.changeTheme(theme);
  }

}
