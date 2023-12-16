import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NotesService } from '../services/notes.service';

export const apiResolver: ResolveFn<any> = (route, state) => {
  let noteService = inject(NotesService);
  let apiUrl: string = '';
  switch (state.url) {
    case '/notes':
      apiUrl = '/api/notes/';
      break;
    case '/notes/reminder':
      apiUrl = '/api/notes/?fetch=remainder';
      break;
    case '/notes/label':
      return noteService.getLabelFromDB('/api/labels/');
    case '/notes/archive':
      apiUrl = '/api/notes/archive/';
      break;
    case '/notes/trash':
      apiUrl = '/api/notes/trash/';
  }
  return noteService.getNotesFromDB(apiUrl);
};
