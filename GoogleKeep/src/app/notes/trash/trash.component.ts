import { OnInit, Component } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent {
  constructor(private noteService: NotesService) {}

  get length() {
    return this.noteService.noteList.length;
  }

  deleteAllTrashNotes() {
    this.noteService.deleteAllTrashNotes();
  }
}
