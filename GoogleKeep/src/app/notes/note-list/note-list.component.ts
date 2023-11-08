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

  constructor(private noteService: NotesService) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/');
  }

  removeReminder(id: number) {
    this.noteService.removeReminderFromDB(id, 'notes');
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
