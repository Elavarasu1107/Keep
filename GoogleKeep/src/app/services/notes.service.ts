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
  noteList!: note[];
  reminderData!: any;
  noteListReminder!: any;
  noteId!: number;

  constructor() {
    // this.noteId = 0;
    // this.noteListReminder = {};
  }

  setNoteToView(newNoteData: note) {
    this.noteList = [newNoteData, ...this.noteList];
  }

  setReminderForNotes(date: string) {
    this.reminderData = date;
  }

  updateReminderForNotes(id: number, data: string) {
    this.noteList.map((item) => {
      if (item.id === id) {
        item.remainder = data;
        this.noteList = [...this.noteList];
      }
    });
  }
}
