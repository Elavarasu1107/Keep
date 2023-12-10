import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit, AfterContentChecked, OnDestroy {
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
    this.cookie.getToken();
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
