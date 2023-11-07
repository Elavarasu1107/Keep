import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { CookieService } from './cookie.service';
import { Observer } from 'rxjs';

interface note {
  id: number;
  title: string;
  description: string;
  color: string;
  remainder: string | Date | null;
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

  constructor(private httpService: HttpService, private cookie: CookieService) {
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
        this.httpService
          .update(
            `/notes/?id=${item.id}`,
            { remainder: data },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }

  getNotesFromDB(endPoint: string) {
    this.httpService
      .get(endPoint, `Bearer ${this.cookie.getToken()}`)
      .subscribe(
        (observer: Observer<any>) => {
          complete: {
            const data: any = observer;
            this.noteList = data?.data;
          }
        },
        (error) => {}
      );
  }

  removeReminderFromDB(id: number) {
    this.noteList.map((item) => {
      if (item.id === id) {
        item.remainder = null;
        this.noteList = [...this.noteList];
        this.httpService
          .update(
            `/notes/?id=${item.id}`,
            { remainder: item.remainder },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }
}
