import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from '../../../services/cookie.service';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { NotesService } from 'src/app/services/notes.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-label-dialog',
  templateUrl: './label-dialog.component.html',
  styleUrls: ['./label-dialog.component.scss'],
})
export class LabelDialogComponent implements OnInit, OnDestroy {
  labelList: string[] = [];
  subscription = new Subscription();

  constructor(
    private noteService: NotesService,
    private httpService: HttpService,
    private cookie: CookieService,
    public dialogRef: MatDialogRef<LabelDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public labelData: string[]
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.httpService
        .get(environment.labelUrl, `Bearer ${this.cookie.getToken()}`)
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
