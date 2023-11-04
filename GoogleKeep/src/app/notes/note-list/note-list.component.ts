import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { HttpService } from '../../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  noteList!: any;

  constructor(private http: HttpService, private cookie: CookieService) {}

  ngOnInit(): void {
    this.http.get('/notes/', `Bearer ${this.cookie.getToken()}`).subscribe(
      (observer: Observer<any>) => {
        // error: () => {};
        complete: {
          this.noteList = observer;
          this.noteList = this.noteList.data;
        }
      },
      (error) => {}
    );
  }
}
