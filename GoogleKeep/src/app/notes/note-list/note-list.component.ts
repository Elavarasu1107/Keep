import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateNoteDialogComponent } from './update-note-dialog/update-note-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit, OnDestroy {
  noteList!: any;
  showNoteOptions!: number | null;
  subscription = new Subscription();
  noteImage!: File | undefined;
  imageUrl!: string;
  loggedInUser!: any;

  @Input() tabs: string = 'notes';

  constructor(
    private noteService: NotesService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.loginService.getLoggedUser();
    this.imageUrl = environment.mediaUrl;
    this.noteService.checkCookie();
    this.noteService.subscribeNotes(this.activeRoute.snapshot.data['data']);
  }

  getImageData(data: any) {
    this.noteImage = data[0];
    this.noteService.updateImageToNote(this.noteImage);
  }

  removeReminder(id: number) {
    this.subscription.add(this.noteService.removeReminderFromDB(id, this.tabs));
  }

  removeCollaborator(id: number, email: string) {
    // this.subscription.add(this.noteService.removeCollaboratorFromDB(id, email));
  }

  removeLabel(id: number, label: string) {
    this.subscription.add(this.noteService.removeLabelFromDB(id, label));
  }

  getNoteList() {
    return this.noteService.noteList;
  }

  updateNoteDialog(note: any) {
    this.dialog.open(UpdateNoteDialogComponent, {
      data: note,
      width: '30rem',
      maxHeight: '90vh',
    });
  }

  setNoteColor(value: string) {
    this.noteService.updateColorToNote(value);
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
