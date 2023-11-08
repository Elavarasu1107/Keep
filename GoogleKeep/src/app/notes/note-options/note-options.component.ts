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
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-note-options',
  templateUrl: './note-options.component.html',
  styleUrls: ['./note-options.component.scss'],
})
export class NoteOptionsComponent implements AfterViewInit {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @Input() fromComp!: string;
  @Input() noteId!: any;

  constructor(
    private dialog: MatDialog,
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService
  ) {}

  ngAfterViewInit(): void {
    // console.log(this.noteId);
    // this.noteService.noteId = this.noteId;
  }

  setNoteId() {
    this.noteService.noteId = this.noteId;
  }

  addNoteToArchive() {
    this.noteService.noteList.map((item) => {
      if (item.id === this.noteId) {
        item.is_archive = !item.is_archive;
        if (this.fromComp === 'notes') {
          let index = this.noteService.noteList.indexOf(item);
          this.noteService.noteList.splice(index, 1);
        }
        this.noteService.noteList = [...this.noteService.noteList];
      }
    });

    this.httpService
      .update(
        `/notes/archive/?id=${this.noteId}`,
        {},
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp: any) => {});
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
