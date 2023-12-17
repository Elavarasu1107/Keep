import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from 'src/app/services/notes.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-note-dialog',
  templateUrl: './update-note-dialog.component.html',
  styleUrls: ['./update-note-dialog.component.scss'],
})
export class UpdateNoteDialogComponent {
  imageUrl = environment.mediaUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    private noteService: NotesService
  ) {}

  updateNote(title: string, description: string) {
    let updataData = {};
    if (this.data.image === null) {
      updataData = {
        id: this.data.id,
        title: title,
        description: description,
        image: this.data.image,
      };
    } else {
      updataData = {
        id: this.data.id,
        title: title,
        description: description,
      };
    }
    this.noteService.updateNotesData(updataData);
  }
}
