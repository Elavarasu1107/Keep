import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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
import { Subscription } from 'rxjs';

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
  template: ` <h1 mat-dialog-title class="text-center">Edit labels</h1>
    <mat-dialog-actions class="d-flex justify-content-center">
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
          <button class="btn" (click)="enableInput(label.title)">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </button>
          <input
            type="text"
            [value]="label.title"
            [disabled]="disableInput"
            style="width: 10rem; height: 2rem;"
            class="label-input rounded"
            (keydown.enter)="updateLabel(inputValue.value, label.id)"
            #inputValue
          />
          <button class="btn" (click)="deleteLabel(label.id)">
            <svg
              class="mx-1"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </button>
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
class LabelDialogComponent implements OnInit, AfterContentChecked, OnDestroy {
  labels!: any;
  disableInput: boolean = true;
  subscription = new Subscription();

  constructor(
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // this.subscription.add(this.noteService.getLabelFromDB('/labels/'));
    this.labels = this.noteService.labelList;
  }

  ngAfterContentChecked(): void {
    this.labels = this.getlabelArr();
  }

  addLabel(ele: HTMLInputElement) {
    this.subscription.add(
      this.httpService
        .post(
          '/labels/',
          { title: ele.value },
          `Bearer ${this.cookie.getToken()}`
        )
        .subscribe((resp: any) => {
          const data = resp;
          this.noteService.labelList = [
            ...this.noteService.labelList,
            data?.data,
          ];
        })
    );
    ele.value = '';
  }

  getlabelArr() {
    this.labels = this.noteService.labelList;
    return this.labels;
  }

  enableInput(label: string) {
    const labelsDiv =
      this.el.nativeElement.getElementsByClassName('label-input');
    Array.from(labelsDiv).forEach((item: any) => {
      item.disabled = true;
    });
    Array.from(labelsDiv).forEach((item: any) => {
      if (item.value === label) {
        item.disabled = false;
      }
    });
  }

  updateLabel(newValue: string, id: number) {
    this.subscription.add(
      this.httpService
        .update(
          `/labels/?id=${id}`,
          { title: newValue },
          `Bearer ${this.cookie.getToken()}`
        )
        .subscribe((resp) => {
          this.noteService.labelList.map((item) => {
            if (item.id === resp.data.id) {
              item = resp.data;
              this.noteService.labelList = [...this.noteService.labelList];
            }
          });
        })
    );
    const labelsDiv =
      this.el.nativeElement.getElementsByClassName('label-input');
    Array.from(labelsDiv).forEach((item: any) => {
      item.disabled = true;
    });
  }

  deleteLabel(id: number) {
    this.subscription.add(
      this.httpService
        .delete(`/labels/?id=${id}`, `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp: any) => {
          this.noteService.labelList.map((item) => {
            if (item.id === id) {
              this.noteService.labelList.splice(
                this.noteService.labelList.indexOf(item),
                1
              );
              this.noteService.labelList = [...this.noteService.labelList];
            }
          });
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
