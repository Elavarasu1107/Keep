import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotesService } from '../../services/notes.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-options',
  templateUrl: './note-options.component.html',
  styleUrls: ['./note-options.component.scss'],
})
export class NoteOptionsComponent implements AfterViewInit {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @Input() noteId!: any;

  constructor(private dialog: MatDialog, private noteService: NotesService) {}

  ngAfterViewInit(): void {
    // console.log(this.noteId);
    // this.noteService.noteId = this.noteId;
  }

  showId() {
    this.noteService.noteId = this.noteId;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogFromMenu, {
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.menuTrigger.focus;
    });
  }
}

@Component({
  selector: 'dialog-from-menu-dialog',
  template: `
    <mat-dialog-actions>
      <input type="datetime-local" [formControl]="inputReminderData" />
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
})
export class DialogFromMenu {
  inputReminderData = new FormControl();
  constructor(private noteService: NotesService) {
    this.inputReminderData.valueChanges.subscribe((value) => {
      if (this.noteService.noteId === undefined) {
        this.noteService.setReminderForNotes(value);
        return;
      }
      this.noteService.updateReminderForNotes(this.noteService.noteId, value);
    });
  }
}
