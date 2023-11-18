import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { HttpService } from '../../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Observer, Subscription } from 'rxjs';
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

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription.add(this.noteService.getNotesFromDB('/notes/'));
  }

  removeReminder(id: number) {
    this.subscription.add(this.noteService.removeReminderFromDB(id, 'notes'));
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
