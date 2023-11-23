import { AfterContentChecked, Component, OnDestroy } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { HttpService } from '../../services/http.service';
import { CookieService } from '../../services/cookie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent implements AfterContentChecked {
  noteListLength!: number;
  constructor(private noteService: NotesService) {}

  ngAfterContentChecked(): void {
    this.noteListLength = this.noteService.noteList.length;
  }

  deleteAllTrashNotes() {
    this.noteService.deleteAllTrashNotes();
  }
}
