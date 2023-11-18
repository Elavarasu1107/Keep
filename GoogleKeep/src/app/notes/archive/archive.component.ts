import {
  Component,
  AfterContentInit,
  AfterContentChecked,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotesService } from 'src/app/services/notes.service';
import { UpdateNoteDialogComponent } from '../note-list/update-note-dialog/update-note-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements AfterContentChecked, OnDestroy {
  noteList!: any;
  showNoteOptions!: number | null;
  subscription = new Subscription();

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription.add(this.noteService.getNotesFromDB('/notes/archive/'));
  }

  ngAfterContentChecked(): void {
    this.noteList = this.getNoteList();
  }

  removeReminder(id: number) {
    this.subscription.add(this.noteService.removeReminderFromDB(id, 'archive'));
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
    this.subscription.add(
      this.noteService.removeCollaboratorFromDB(id, email, 'notes')
    );
  }

  removeLabel(id: number, label: string) {
    this.subscription.add(
      this.noteService.removeLabelFromDB(id, label, 'notes')
    );
  }

  updateNoteDialog(note: any) {
    this.dialog.open(UpdateNoteDialogComponent, {
      data: note,
      width: '30rem',
      height: '35rem',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
