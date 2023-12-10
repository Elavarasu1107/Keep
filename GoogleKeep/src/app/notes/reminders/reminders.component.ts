import { Component, OnInit, inject, DoCheck } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnInit, DoCheck {
  noteListLength!: number;
  noteService: NotesService = inject(NotesService);

  ngOnInit(): void {
    this.noteService.checkCookie();
  }

  ngDoCheck(): void {
    this.noteListLength = this.noteService.noteList.length;
  }
}
