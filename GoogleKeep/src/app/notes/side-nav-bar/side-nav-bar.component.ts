import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavTogglerService } from 'src/app/services/side-nav-toggler.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent {
  @ViewChild('sideNav') sideNav!: MatSidenav;
  isSideNavOpen: boolean = false;
  constructor(private togglerService: SideNavTogglerService) {}

  getBooleanService() {
    return this.togglerService.getBooleanValue();
  }

  toggleSideNav() {
    this.sideNav.toggle();
  }

  showNavBar() {
    console.log('mouse in');

    this.isSideNavOpen = true;
    // this.sideNav.opened = true;
  }

  hideNavBar() {
    console.log('mouse out');

    this.isSideNavOpen = false;
    // this.sideNav.opened = false;
  }
}
