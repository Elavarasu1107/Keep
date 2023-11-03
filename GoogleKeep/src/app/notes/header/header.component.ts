import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SideNavTogglerService } from 'src/app/services/side-nav-toggler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('sideNavBar') sideMenuBar!: ElementRef;

  constructor(private togglerService: SideNavTogglerService) {}

  // booleanValue$ = this.togglerService.booleanValue$;

  triggerToggleService() {
    this.togglerService.toggleBoolean();
  }
}
