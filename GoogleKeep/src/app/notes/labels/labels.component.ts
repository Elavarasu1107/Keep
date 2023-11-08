import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }

  openDialog() {
    this.dialog.open(LabelDialogComponent);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: ` <h1 mat-dialog-title>Edit labels</h1>
    <mat-dialog-actions>
      <input
        matInput
        #label
        type="text"
        (keydown.enter)="addLabel(label)"
        style="width: 12rem;"
        class="border border-primary rounded"
      />
    </mat-dialog-actions>
    <div style="overflow: auto; max-height:10rem;">
      <div *ngFor="let label of labels">
        <div class="mx-2 mt-1 align-items-center">
          <input
            type="text"
            [value]="label.title"
            [disabled]="disableInput"
            style="width: 10rem; height: 2rem;"
          />
          <button class="btn btn-light" style="padding: 3px 10px;">X</button>
        </div>
      </div>
    </div>
    <div mat-dialog-actions class="d-flex justify-content-center">
      <button mat-button mat-dialog-close>Close</button>
    </div>`,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
class LabelDialogComponent implements OnInit, AfterContentChecked {
  // labels = new FormArray<FormControl>([]);
  labels!: any;
  disableInput: boolean = true;
  constructor(
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.noteService.getLabelFromDB('/labels/');
    this.labels = this.noteService.labelList;
  }

  ngAfterContentChecked(): void {
    this.labels = this.getlabelArr();
  }

  addLabel(ele: HTMLInputElement) {
    this.noteService.labelList = [
      ...this.noteService.labelList,
      { title: ele.value, font: null, id: null, user: null, color: null },
    ];
    this.httpService
      .post(
        '/labels/',
        { title: ele.value },
        `Bearer ${this.cookie.getToken()}`
      )
      .subscribe((resp: any) => {});
    ele.value = '';
  }

  getlabelArr() {
    this.labels = this.noteService.labelList;
    return this.labels;
  }
}
