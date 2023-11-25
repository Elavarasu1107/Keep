import { Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent {
  noteListLength!: number;
  constructor(private noteService: NotesService) {
    this.noteService.checkCookie();
  }

  get length() {
    return this.noteService.noteList.length;
  }
}
