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
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { NoteOptionsComponent } from './note-options/note-options.component';
import { MatChipsModule } from '@angular/material/chips';
import { ArchiveComponent } from './archive/archive.component';
import { RemindersComponent } from './reminders/reminders.component';
import { LabelsComponent } from './labels/labels.component';
import { TrashComponent } from './trash/trash.component';

@NgModule({
  declarations: [
    NoteComponent,
    HeaderComponent,
    SideNavBarComponent,
    NoteExpansionPanelComponent,
    NoteListComponent,
    NoteOptionsComponent,
    ArchiveComponent,
    RemindersComponent,
    LabelsComponent,
    TrashComponent,
  ],
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
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatChipsModule,
  ],
})
export class NotesModule {}
