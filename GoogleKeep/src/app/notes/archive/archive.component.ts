import { Component, OnInit, inject, DoCheck } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit, DoCheck {
  noteListLength!: number;
  noteService: NotesService = inject(NotesService);

  ngOnInit(): void {
    this.noteService.checkCookie();
  }

  ngDoCheck(): void {
    this.noteListLength = this.noteService.noteList.length;
  }
}
