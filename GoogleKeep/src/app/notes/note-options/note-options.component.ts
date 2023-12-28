import {
  Component,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotesService } from '../../services/notes.service';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';
import { Subscription } from 'rxjs';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog.component';
import { CollaboratorDialogComponent } from './collaborator-dialog/collaborator-dialog.component';
import { LabelDialogComponent } from './label-dialog/label-dialog.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-note-options',
  templateUrl: './note-options.component.html',
  styleUrls: ['./note-options.component.scss'],
})
export class NoteOptionsComponent implements OnDestroy {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @Input() fromComp!: string;
  @Input() noteId!: any;
  @Input() collaborator!: string[];
  @Input() labels!: string[];
  @Output() noteImage = new EventEmitter<File>();
  @Output() is_archive = new EventEmitter<boolean>();
  @Output() noteColor = new EventEmitter<string>();
  paletteList = [
    '#FFFFFF',
    '#FAAFA8',
    '#F39F76',
    '#FFF8B8',
    '#E2F6D3',
    '#B4DDD3',
    '#D4E4ED',
    '#AECCDC',
    '#D3BFDB',
    '#F6E2DD',
    '#E9E3D4',
    '#EFEFF1',
  ];
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService
  ) {}

  setNoteId() {
    this.noteService.noteId = this.noteId;
  }

  setReminderForToday(day: string) {
    const now = new Date();

    let time: string = '';
    if (day === 'today') {
      time = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}T20:00Z`;
    } else if (day === 'tomorrow') {
      time = `${now.getFullYear()}-${now.getMonth() + 1}-${
        now.getDate() + 1
      }T08:00Z`;
    } else {
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7;
      now.setDate(now.getDate() + daysUntilMonday);
      time = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}T08:00Z`;
    }
    if (this.noteService.noteId === undefined) {
      this.noteService.setReminderForNotes(time);
      return;
    }
    this.noteService.updateReminderForNotes(this.noteService.noteId, time);
  }

  onFileSelected(event: any) {
    this.noteImage.emit(event.target.files);
  }

  emitColor(color: string) {
    this.setNoteId();
    this.noteColor.emit(color);
  }

  deleteNote() {
    if (!this.noteId) {
      return;
    }
    this.httpService
      .update(
        `${environment.trashUrl}?id=${this.noteId}`,
        {},
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp) => {
        this.noteService.noteList.map((item) => {
          if (item.id === this.noteId) {
            this.noteService.noteList.splice(
              this.noteService.noteList.indexOf(item),
              1
            );
          }
          this.noteService.noteList = [...this.noteService.noteList];
        });
      });
  }

  addNoteToArchive() {
    if (!this.noteId) {
      this.is_archive.emit(true);
      return;
    }
    this.noteService.noteList.map((item) => {
      if (item.id === this.noteId) {
        item.is_archive = !item.is_archive;
        if (this.fromComp === 'notes' || this.fromComp === 'archive') {
          let index = this.noteService.noteList.indexOf(item);
          this.noteService.noteList.splice(index, 1);
        }
        this.noteService.noteList = [...this.noteService.noteList];
      }
    });

    this.httpService
      .update(
        `${environment.archiveUrl}?id=${this.noteId}`,
        {},
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp: any) => {});
  }

  showCollaborators() {
    if (!this.cookie.getToken()) return;
    const dialogRef = this.dialog.open(CollaboratorDialogComponent, {
      restoreFocus: false,
      width: '30rem',
      // height: '15rem',
      data: this.collaborator,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data != undefined) {
        this.subscription.add(
          this.noteService.setCollaboratorForNotes(data.collaborators)
        );
      }
      this.menuTrigger.focus;
    });
  }

  openDialog() {
    if (!this.cookie.getToken()) return;
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.menuTrigger.focus;
    });
  }

  openLabelDialog() {
    if (!this.cookie.getToken()) return;
    const dialogRef = this.dialog.open(LabelDialogComponent, {
      restoreFocus: false,
      data: this.labels,
      width: '20rem',
      // height: '10rem',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data != undefined) this.noteService.setLabelForNotes(data);
      this.menuTrigger.focus;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
