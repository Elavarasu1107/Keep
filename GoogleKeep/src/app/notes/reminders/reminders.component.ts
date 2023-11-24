import { Component, AfterContentChecked } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements AfterContentChecked {
  noteListLength!: number;
  constructor(private noteService: NotesService) {}

  ngAfterContentChecked(): void {
    this.noteListLength = this.noteService.noteList.length;
  }
}
