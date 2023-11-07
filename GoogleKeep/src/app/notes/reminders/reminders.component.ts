import { Component } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent {
  noteList!: any;
  showNoteOptions: boolean = false;

  constructor(private noteService: NotesService) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/?fetch=remainder');
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
