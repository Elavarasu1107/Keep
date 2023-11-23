import {
  Component,
  AfterContentChecked,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { UpdateNoteDialogComponent } from '../note-list/update-note-dialog/update-note-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

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
