import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   component: NoteComponent,
  //   children: [
  //     { path: '', component: NoteListComponent },
  //     { path: 'reminder', component: RemindersComponent },
  //     { path: 'label', component: LabelsComponent },
  //     { path: 'archive', component: ArchiveComponent },
  //     { path: 'trash', component: TrashComponent },
  //   ],
  //   canActivate: [cookieGuard],
  //   pathMatch: 'full',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
