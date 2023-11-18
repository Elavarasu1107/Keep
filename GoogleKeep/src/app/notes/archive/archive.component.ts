import {
  Component,
  AfterContentInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotesService } from 'src/app/services/notes.service';
import { UpdateNoteDialogComponent } from '../note-list/update-note-dialog/update-note-dialog.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements AfterContentChecked {
  noteList!: any;
  showNoteOptions!: number | null;

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/archive/');
  }

  ngAfterContentChecked(): void {
    this.noteList = this.getNoteList();
    // this.changeDetectionRef.markForCheck();
  }

  removeReminder(id: number) {
    this.noteService.removeReminderFromDB(id, 'archive');
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  showOptions(id: number) {
    this.showNoteOptions = id;
  }

  hideOptions() {
    this.showNoteOptions = null;
  }

  removeCollaborator(id: number, email: string) {
    this.noteService.removeCollaboratorFromDB(id, email, 'notes');
  }

  removeLabel(id: number, label: string) {
    this.noteService.removeLabelFromDB(id, label, 'notes');
  }

  updateNoteDialog(note: any) {
    this.dialog.open(UpdateNoteDialogComponent, {
      data: note,
      width: '30rem',
      height: '35rem',
    });
  }
}
