import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavTogglerService } from 'src/app/services/side-nav-toggler.service';
import { NoteListComponent } from '../note-list/note-list.component';
import { ArchiveComponent } from '../archive/archive.component';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements AfterViewInit {
  @ViewChild('sideNav') sideNav!: MatSidenav;
  @ViewChild('dynamicContent', { read: ViewContainerRef })
  dynamicContent!: ViewContainerRef;

  isSideNavOpen: boolean = false;
  constructor(private togglerService: SideNavTogglerService) {}

  ngAfterViewInit(): void {
    this.dynamicContent.createComponent(NoteListComponent);
  }

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

  loadComponent(componentName: string) {
    this.dynamicContent.clear();

    let componentType!: any;

    switch (componentName) {
      case 'notes':
        componentType = NoteListComponent;
        break;
      case 'reminders':
        componentType = '';
        break;
      case 'labels':
        componentType = '';
        break;
      case 'archive':
        componentType = ArchiveComponent;
        break;
      case 'trash':
        componentType = '';
        break;
      default:
        componentType = NoteListComponent;
    }
    if (componentType) {
      this.dynamicContent.createComponent(componentType);
    }
  }
}
