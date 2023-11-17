import {
  Component,
  AfterContentChecked,
  AfterViewInit,
  AfterContentInit,
} from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements AfterContentChecked {
  noteList!: any;
  showNoteOptions!: number | null;

  constructor(private noteService: NotesService) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/?fetch=remainder');
  }

  ngAfterContentChecked(): void {
    this.noteList = this.getNoteList();
  }

  removeReminder(id: number) {
    this.noteService.removeReminderFromDB(id, 'reminder');
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

  removeCollaborator(id: number, email: string) {
    this.noteService.removeCollaboratorFromDB(id, email, 'notes');
  }

  removeLabel(id: number, label: string) {
    this.noteService.removeLabelFromDB(id, label, 'notes');
  }
}
