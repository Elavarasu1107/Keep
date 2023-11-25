import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  EventEmitter,
  Output,
  OnInit,
  Optional,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotesService } from '../../services/notes.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-options',
  templateUrl: './note-options.component.html',
  styleUrls: ['./note-options.component.scss'],
})
export class NoteOptionsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @Input() fromComp!: string;
  @Input() noteId!: any;
  @Output() noteImage = new EventEmitter<File>();
  @Output() is_archive = new EventEmitter<boolean>();
  subscription = new Subscription();

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

  deleteNote() {
    if (!this.noteId) {
      return;
    }
    this.httpService
      .update(
        `/notes/trash/?id=${this.noteId}`,
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
        `/notes/archive/?id=${this.noteId}`,
        {},
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp: any) => {});
  }

  showCollaborators() {
    const dialogRef = this.dialog.open(CollaboratorDialog, {
      restoreFocus: false,
      width: '30rem',
      height: '20rem',
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
    const dialogRef = this.dialog.open(DialogFromMenu, {
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.menuTrigger.focus;
    });
  }

  openLabelDialog() {
    const dialogRef = this.dialog.open(LabelDialog, {
      restoreFocus: false,
      width: '20rem',
      maxHeight: '20rem',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.noteService.setLabelForNotes(data);
      this.menuTrigger.focus;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  imports: [MatDialogModule, ReactiveFormsModule],
})
export class DialogFromMenu implements OnDestroy {
  inputReminderData = new FormControl();
  subscription = new Subscription();
  constructor(private noteService: NotesService) {
    this.inputReminderData.valueChanges.subscribe((value) => {
      if (this.noteService.noteId === undefined) {
        this.subscription.add(this.noteService.setReminderForNotes(value));
        return;
      }
      this.subscription.add(
        this.noteService.updateReminderForNotes(this.noteService.noteId, value)
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'dialog-from-menu-dialog',
  template: `<h1 mat-dialog-title>Collaborators</h1>
    <div mat-dialog-content>
      <div
        *ngFor="let col of collaborators"
        class="align-items-center d-flex justify-content-between border border-2 rounded p-2 m-1 bg-light"
      >
        <h4 class="m-0 p-0">{{ col }}</h4>
        <mat-icon (click)="removeCollaborator(col)">close</mat-icon>
      </div>
      <input
        class="form-control mt-2"
        type="text"
        placeholder="Search collaborators"
        [(ngModel)]="searchTerm"
        (keyup)="filterCollaborators()"
      />
      <div class="mt-2 d-flex flex-column">
        <button
          mat-button
          *ngFor="let email of filteredUsers"
          (click)="addCollaborator(email)"
          class="btn btn-outline-secondary d-flex justify-content-start"
        >
          <span>{{ email }}</span>
        </button>
      </div>
    </div>
    <div mat-dialog-actions class="d-flex justify-content-end">
      <button mat-button mat-dialog-close (click)="onClose()">Save</button>
    </div>`,
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
  ],
})
export class CollaboratorDialog implements OnInit, OnDestroy {
  allUsers!: any[];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  collaborators: string[] = [];
  subscription = new Subscription();
  constructor(
    private httpService: HttpService,
    private cookie: CookieService,
    public dialogRef: MatDialogRef<CollaboratorDialog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public collabData: string[]
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.httpService
        .get(`/user/api/registration/`, `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          this.allUsers = resp.data;
        })
    );
  }

  filterCollaborators() {
    if (this.searchTerm != '') {
      this.filteredUsers = this.allUsers
        .filter((user) =>
          user.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
        .sort();
    } else {
      this.filteredUsers = [];
    }
  }

  addCollaborator(email: string) {
    this.collaborators.push(email);
    this.filteredUsers.splice(this.filteredUsers.indexOf(email), 1);
  }

  removeCollaborator(email: string) {
    this.collaborators.splice(this.collaborators.indexOf(email), 1);
  }

  onClose() {
    this.dialogRef.close({ collaborators: this.collaborators });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'dialog-from-menu-dialog',
  template: `
    <h2 class="text-center">Labels</h2>
    <mat-dialog-actions class="d-flex flex-column justify-content-start">
      <div *ngFor="let label of getLabels()">
        <mat-checkbox
          (change)="isChecked($event, label.title)"
          [value]="label.title"
          >{{ label.title }}</mat-checkbox
        >
      </div>
      <div mat-dialog-actions class="d-flex justify-content-end">
        <button
          mat-button
          mat-dialog-close
          (click)="onSave()"
          class="btn btn-outline-secondary"
        >
          Save
        </button>
      </div>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
  ],
})
export class LabelDialog implements OnInit, OnDestroy {
  labelList: string[] = [];
  subscription = new Subscription();

  constructor(
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService,
    public dialogRef: MatDialogRef<LabelDialog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public labelData: string[]
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.httpService
        .get('/labels/', `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          this.noteService.labelList = resp.data;
        })
    );
  }

  getLabels() {
    return this.noteService.labelList;
  }

  isChecked(event: any, labelName: string) {
    event.checked
      ? this.labelList.push(labelName)
      : this.labelList.splice(this.labelList.indexOf(labelName), 1);
  }

  onSave() {
    this.dialogRef.close({ labels: this.labelList });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
