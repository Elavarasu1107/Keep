import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NotesService } from '../services/notes.service';

export const apiResolver: ResolveFn<any> = (route, state) => {
  let noteService = inject(NotesService);
  let apiUrl: string = '';
  switch (state.url) {
    case '/notes':
      apiUrl = '/notes/';
      break;
    case '/notes/reminder':
      apiUrl = '/notes/?fetch=remainder';
      break;
    case '/notes/label':
      return noteService.getLabelFromDB('/labels/');
    case '/notes/archive':
      apiUrl = '/notes/archive/';
      break;
    case '/notes/trash':
      apiUrl = '/notes/trash/';
  }
  return noteService.getNotesFromDB(apiUrl);
};
