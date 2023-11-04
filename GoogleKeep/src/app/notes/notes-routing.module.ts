import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteComponent } from './note/note.component';
import { cookieGuard } from '../guards/cookie.guard';

const routes: Routes = [
  {
    path: 'notes',
    component: NoteComponent,
    canActivate: [cookieGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
