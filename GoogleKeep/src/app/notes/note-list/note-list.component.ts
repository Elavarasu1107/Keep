import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNoteDialogComponent } from './update-note-dialog/update-note-dialog.component';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit, OnDestroy {
  noteList!: any;
  showNoteOptions!: number | null;
  subscription = new Subscription();

  @Input() tabs: string = 'notes';
  @Input() apiUrl: string = '/notes/';

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription.add(this.noteService.getNotesFromDB(this.apiUrl));
  }

  removeReminder(id: number) {
    this.subscription.add(this.noteService.removeReminderFromDB(id, this.tabs));
  }

  removeCollaborator(id: number, email: string) {
    this.subscription.add(
      this.noteService.removeCollaboratorFromDB(id, email, this.tabs)
    );
  }

  removeLabel(id: number, label: string) {
    this.subscription.add(
      this.noteService.removeLabelFromDB(id, label, this.tabs)
    );
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  updateNoteDialog(note: any) {
    this.dialog.open(UpdateNoteDialogComponent, {
      data: note,
      width: '30rem',
      height: '35rem',
    });
  }

  showOptions(id: number) {
    this.showNoteOptions = id;
  }

  hideOptions() {
    this.showNoteOptions = null;
  }

  restoreNote(id: number) {
    this.noteService.restoreNote(id);
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
