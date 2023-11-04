import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NoteComponent } from './note/note.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { MatInputModule } from '@angular/material/input';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoteExpansionPanelComponent } from './note-expansion-panel/note-expansion-panel.component';
import { NoteListComponent } from './note-list/note-list.component';

@NgModule({
  declarations: [NoteComponent, HeaderComponent, SideNavBarComponent, NoteExpansionPanelComponent, NoteListComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
  ],
})
export class NotesModule {}
