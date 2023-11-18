import { Component, OnDestroy } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent implements OnDestroy {
  noteList!: any;
  showNoteOptions!: number | null;
  subscription = new Subscription();

  constructor(
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.noteService.getNotesFromDB('/notes/trash/'));
  }

  ngAfterContentChecked(): void {
    this.noteList = this.getNoteList();
  }

  restoreNote(id: number) {
    this.subscription.add(
      this.httpService
        .update(
          `/notes/trash/?id=${id}`,
          {},
          `Bearer ${this.cookie.getToken()}`
        )
        .subscribe((resp) => {
          this.noteService.noteList.map((item) => {
            if (item.id === id) {
              this.noteService.noteList.splice(
                this.noteService.noteList.indexOf(item),
                1
              );
            }
            this.noteService.noteList = [...this.noteService.noteList];
          });
        })
    );
  }

  deleteNote(id: number) {
    this.subscription.add(
      this.httpService
        .delete(`/notes/?id=${id}`, `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          this.noteService.noteList.map((item) => {
            if (item.id === id) {
              this.noteService.noteList.splice(
                this.noteService.noteList.indexOf(item),
                1
              );
            }
            this.noteService.noteList = [...this.noteService.noteList];
          });
        })
    );
  }

  deleteAllTrashNotes() {
    this.subscription.add(
      this.httpService
        .delete('/notes/?delete_all=true', `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          this.noteService.noteList = this.noteService.noteList.filter(
            (item) => false
          );
        })
    );
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  showOptions(id: number) {
    this.showNoteOptions = id;
  }

  hideOptions() {
    this.showNoteOptions = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
