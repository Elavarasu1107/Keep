import { OnInit, Component, inject, DoCheck } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent implements OnInit, DoCheck {
  noteListLength!: number;
  noteService: NotesService = inject(NotesService);

  ngOnInit(): void {
    this.noteService.checkCookie();
  }

  ngDoCheck(): void {
    this.noteListLength = this.noteService.noteList.length;
  }

  deleteAllTrashNotes() {
    this.noteService.deleteAllTrashNotes();
  }
}
