import {
  Component,
  AfterContentInit,
  AfterContentChecked,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotesService } from 'src/app/services/notes.service';
import { UpdateNoteDialogComponent } from '../note-list/update-note-dialog/update-note-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements AfterContentChecked {
  noteListLength!: number;
  constructor(private noteService: NotesService) {}

  ngAfterContentChecked(): void {
    this.noteListLength = this.noteService.noteList.length;
  }
}
