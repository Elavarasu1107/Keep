import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { environment } from '../../environments/environment';

export const apiResolver: ResolveFn<any> = (route, state) => {
  let noteService = inject(NotesService);
  let apiUrl: string = '';
  switch (state.url) {
    case '/notes':
      apiUrl = environment.notesUrl;
      break;
    case '/notes/reminder':
      apiUrl = environment.reminderUrl;
      break;
    case '/notes/label':
      return noteService.getLabelFromDB(environment.labelUrl);
    case '/notes/archive':
      apiUrl = environment.archiveUrl;
      break;
    case '/notes/trash':
      apiUrl = environment.trashUrl;
  }
  return noteService.getNotesFromDB(apiUrl);
};
