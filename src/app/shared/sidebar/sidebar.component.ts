import { Component } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent {

  public menuItems : any[] = []

  constructor(public _sideBarService: SidebarService) {

  }

  
}
