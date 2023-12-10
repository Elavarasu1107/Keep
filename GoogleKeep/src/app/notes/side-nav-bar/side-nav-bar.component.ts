import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NotesService } from '../../services/notes.service';
import { SideNavTogglerService } from '../../services/side-nav-toggler.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelsComponent } from '../labels/labels.component';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent {
  @ViewChild('sideNav') sideNav!: MatSidenav;
  @Output() activeTab = new EventEmitter<string>();

  isSideNavOpen: boolean = false;
  constructor(
    private togglerService: SideNavTogglerService,
    protected noteService: NotesService,
    public dialog: MatDialog
  ) {}

  openLabelDialog() {
    if (!this.noteService.checkCookie()) return;
    this.noteService.getLabelFromDB('/labels/');
    this.dialog.open(LabelsComponent);
  }

  getBooleanService() {
    return this.togglerService.getBooleanValue();
  }

  toggleSideNav() {
    this.sideNav.toggle();
  }

  showNavBar() {
    this.isSideNavOpen = true;
    // this.sideNav.opened = true;
  }

  hideNavBar() {
    this.isSideNavOpen = false;
    // this.sideNav.opened = false;
  }
}
