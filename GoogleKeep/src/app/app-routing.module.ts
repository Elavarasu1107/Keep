import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './notes/archive/archive.component';
import { LabelsComponent } from './notes/labels/labels.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { RemindersComponent } from './notes/reminders/reminders.component';
import { TrashComponent } from './notes/trash/trash.component';
import { NoteComponent } from './notes/note/note.component';
import { cookieGuard } from './guards/cookie.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'notes',
    component: NoteComponent,
    children: [
      { path: '', component: NoteListComponent, pathMatch: 'full' },
      { path: 'reminder', component: RemindersComponent, pathMatch: 'full' },
      { path: 'label', component: LabelsComponent, pathMatch: 'full' },
      { path: 'archive', component: ArchiveComponent, pathMatch: 'full' },
      { path: 'trash', component: TrashComponent, pathMatch: 'full' },
    ],
    pathMatch: 'prefix',
    canActivate: [cookieGuard],
    canActivateChild: [cookieGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
