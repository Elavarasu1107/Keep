import { Injectable } from '@angular/core';

interface note {
  id: number;
  title: string;
  description: string;
  color: string;
  remainder: string | Date;
  is_archive: boolean;
  is_trash: boolean;
  user: number;
  collaborator: [];
  label: [];
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  noteData!: any;
  noteList!: note[];

  constructor() {}

  setNoteToView(newNoteData: note) {
    this.noteList = [newNoteData, ...this.noteList];
  }
}
