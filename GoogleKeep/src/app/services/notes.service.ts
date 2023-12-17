import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { CookieService } from './cookie.service';
import { Observer } from 'rxjs';
import { environment } from '../../environments/environment';

interface note {
  id: number;
  title: string;
  description: string;
  color: string;
  remainder: string | Date | null;
  is_archive: boolean;
  is_trash: boolean;
  user: number;
  collaborator: string[];
  label: string[];
  image: any;
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
  noteList: note[] = [];
  reminderData!: any;
  noteListReminder!: any;
  noteId!: number;
  labelList!: label[];
  noteLabels: string[] = [];

  collaborators: string[] = [];

  constructor(
    private httpService: HttpService,
    private cookie: CookieService
  ) {}

  checkCookie() {
    return this.cookie.getToken();
  }

  setNoteToView(newNoteData: note) {
    if (!newNoteData.is_archive) {
      if (newNoteData.image != undefined && newNoteData.image != null) {
        let image = newNoteData.image.split('/');
        newNoteData.image = image.slice(-1)[0];
      }
      this.noteList = [newNoteData, ...this.noteList];
    }
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
            `${environment.notesUrl}?id=${item.id}`,
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
            `${environment.notesUrl}?id=${item.id}`,
            data,
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }

  updateImageToNote(data: any) {
    this.noteList.map((item) => {
      if (item.id === this.noteId) {
        const formData = new FormData();
        formData.append('image', data, data.name);
        data = formData;
        this.httpService
          .update(
            `${environment.notesUrl}?id=${item.id}`,
            data,
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {
            let image = resp.data.image.split('/');
            item.image = image.slice(-1)[0];
          });
      }
    });
  }

  setCollaboratorForNotes(collabList: string[]) {
    if (this.noteId === undefined) {
      this.collaborators = collabList;
      return;
    }

    this.noteList.map((note) => {
      if (note.id === this.noteId) {
        this.httpService
          .post(
            environment.collaboratorUrl,
            { id: note.id, collaborator: collabList },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp) => {
            note.collaborator = [...note.collaborator, ...collabList];
          });
      }
    });
    this.noteList = [...this.noteList];
  }

  getNotesFromDB(endPoint: string) {
    return this.httpService.get(endPoint, `Bearer ${this.cookie.getToken()}`);
  }

  subscribeNotes(data: any) {
    data?.data.forEach((note: any) => {
      if (note.image != null) {
        let image = note.image.split('/');
        note.image = image.slice(-1)[0];
      }
    });
    this.noteList = data?.data;
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
            `${environment.notesUrl}?id=${item.id}`,
            { remainder: item.remainder },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }

  removeCollaboratorFromDB(id: number, email: string, component: string) {
    this.noteList.map((item) => {
      if (item.id === id) {
        item.collaborator.splice(item.collaborator.indexOf(email), 1);
        this.noteList = [...this.noteList];
        this.httpService
          .update(
            environment.collaboratorUrl,
            { id: id, collaborator: email },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }

  removeLabelFromDB(id: number, label: string, component: string) {
    this.noteList.map((item) => {
      if (item.id === id) {
        item.label.splice(item.label.indexOf(label), 1);
        this.noteList = [...this.noteList];
        this.httpService
          .update(
            environment.noteLabelUrl,
            { id: id, label: label },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp: any) => {});
      }
    });
  }

  setLabelForNotes(data: any) {
    if (this.noteId === undefined) {
      this.noteLabels = data.labels;
      return;
    }

    this.noteList.map((note) => {
      if (note.id === this.noteId) {
        this.httpService
          .post(
            environment.noteLabelUrl,
            { id: note.id, label: data.labels },
            `Bearer ${this.cookie.getToken()}`
          )
          .subscribe((resp) => {
            note.label = [...note.label, ...data.labels];
          });
      }
    });
    this.noteList = [...this.noteList];
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

  restoreNote(id: number) {
    this.httpService
      .update(
        `${environment.trashUrl}?id=${id}`,
        {},
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp) => {
        this.noteList.map((item) => {
          if (item.id === id) {
            this.noteList.splice(this.noteList.indexOf(item), 1);
          }
          this.noteList = [...this.noteList];
        });
      });
  }

  deleteNote(id: number) {
    this.httpService
      .delete(
        `${environment.notesUrl}?id=${id}`,
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp) => {
        this.noteList.map((item) => {
          if (item.id === id) {
            this.noteList.splice(this.noteList.indexOf(item), 1);
          }
          this.noteList = [...this.noteList];
        });
      });
  }

  deleteAllTrashNotes() {
    this.httpService
      .delete(
        `${environment.notesUrl}?delete_all=true`,
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp) => {
        this.noteList = this.noteList.filter((item) => false);
      });
  }
}
