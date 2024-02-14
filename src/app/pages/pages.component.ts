import { Component, OnInit } from '@angular/core';

import { SettingService } from '../services/setting.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunction() : any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: []
})
export class PagesComponent implements OnInit{

  constructor (private SettingService : SettingService,
              private sidebarService: SidebarService){}

  ngOnInit(): void {

    customInitFunction();
    this.sidebarService.cargarMenu();
  }

}
