import { Component } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent {
  noteListLength!: number;
  constructor(private noteService: NotesService) {
    this.noteService.checkCookie();
  }

  get length() {
    return this.noteService.noteList.length;
  }
}
