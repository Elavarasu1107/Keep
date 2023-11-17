import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { HttpService } from '../../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNoteDialogComponent } from './update-note-dialog/update-note-dialog.component';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  noteList!: any;
  showNoteOptions!: number | null;

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.noteService.getNotesFromDB('/notes/');
  }

  removeReminder(id: number) {
    this.noteService.removeReminderFromDB(id, 'notes');
  }

  removeCollaborator(id: number, email: string) {
    this.noteService.removeCollaboratorFromDB(id, email, 'notes');
  }

  removeLabel(id: number, label: string) {
    this.noteService.removeLabelFromDB(id, label, 'notes');
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  updateNoteDialog(note: any) {
    this.dialog.open(UpdateNoteDialogComponent, { data: note, width: '30rem' });
  }

  showOptions(id: number) {
    this.showNoteOptions = id;
  }

  hideOptions() {
    this.showNoteOptions = null;
  }
}
