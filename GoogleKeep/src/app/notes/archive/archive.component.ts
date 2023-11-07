import { Component } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { Observer } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent {
  noteList!: any;
  showNoteOptions: boolean = false;

  constructor(private noteService: NotesService) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/archive/');
  }

  removeReminder(id: number) {
    this.noteService.removeReminderFromDB(id);
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
