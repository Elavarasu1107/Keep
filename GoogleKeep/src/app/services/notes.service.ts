import { ChangeDetectorRef, Injectable } from '@angular/core';
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

interface label {
  id: number | null;
  title: string;
  font: string | null;
  color: string | null;
  user: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  noteList!: note[];
  reminderData!: any;
  noteListReminder!: any;
  noteId!: number;
  labelList!: label[];

  constructor(private httpService: HttpService, private cookie: CookieService) {
    // this.noteId = 0;
    // this.noteListReminder = {};
  }

  setNoteToView(newNoteData: note) {
    if (!newNoteData.is_archive)
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

  updateNotesData(data: any) {
    this.noteList.map((item) => {
      if (item.id === data.id) {
        item.title = data.title;
        item.description = data.description;
        this.noteList = [...this.noteList];
        this.httpService
          .update(
            `/notes/?id=${item.id}`,
            data,
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

  removeReminderFromDB(id: number, component: string) {
    this.noteList.map((item) => {
      if (item.id === id) {
        item.remainder = null;
        if (component === 'reminder') {
          let index = this.noteList.indexOf(item);
          this.noteList.splice(index, 1);
        }
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

  getLabelFromDB(endPoint: string) {
    this.httpService
      .get(endPoint, `Bearer ${this.cookie.getToken()}`)
      .subscribe(
        (observer: Observer<any>) => {
          complete: {
            const data: any = observer;
            this.labelList = data?.data;
          }
        },
        (error) => {}
      );
  }
}
