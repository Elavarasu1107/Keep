import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './notes/archive/archive.component';
import { LabelsComponent } from './notes/labels/labels.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { RemindersComponent } from './notes/reminders/reminders.component';
import { TrashComponent } from './notes/trash/trash.component';
import { NoteComponent } from './notes/note/note.component';
import { cookieGuard } from './guards/cookie.guard';
import { apiResolver } from './resolver/api.resolver';

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
      {
        path: '',
        component: NoteListComponent,
        pathMatch: 'full',
        resolve: { data: apiResolver },
      },
      {
        path: 'reminder',
        component: RemindersComponent,
        pathMatch: 'full',
        resolve: { data: apiResolver },
      },
      {
        path: 'label',
        component: LabelsComponent,
        pathMatch: 'full',
        resolve: { data: apiResolver },
      },
      {
        path: 'archive',
        component: ArchiveComponent,
        pathMatch: 'full',
        resolve: { data: apiResolver },
      },
      {
        path: 'trash',
        component: TrashComponent,
        pathMatch: 'full',
        resolve: { data: apiResolver },
      },
    ],
    pathMatch: 'prefix',
    resolve: { data: apiResolver },
    canActivate: [cookieGuard],
    canActivateChild: [cookieGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
