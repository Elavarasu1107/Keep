import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { HttpService } from '../../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  noteList!: any;
  showNoteOptions: boolean = false;

  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private noteService: NotesService
  ) {}

  ngOnInit(): void {
    this.http.get('/notes/', `Bearer ${this.cookie.getToken()}`).subscribe(
      (observer: Observer<any>) => {
        // error: () => {};
        complete: {
          // this.noteList = observer;
          // this.noteList = this.noteList.data;
          // this.noteService.noteList = this.noteList;
          const data: any = observer;
          this.noteService.noteList = data?.data;
          // this.noteList = this.noteService.noteList;
        }
      },
      (error) => {}
    );
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  showOptions() {
    this.showNoteOptions = true;
  }

  hideOptions() {
    this.showNoteOptions = false;
  }
}
