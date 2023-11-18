import {
  Component,
  AfterContentChecked,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { UpdateNoteDialogComponent } from '../note-list/update-note-dialog/update-note-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements AfterContentChecked, OnDestroy {
  noteList!: any;
  showNoteOptions!: number | null;
  subscription = new Subscription();

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription.add(
      this.noteService.getNotesFromDB('/notes/?fetch=remainder')
    );
  }

  ngAfterContentChecked(): void {
    this.noteList = this.getNoteList();
  }

  removeReminder(id: number) {
    this.subscription.add(
      this.noteService.removeReminderFromDB(id, 'reminder')
    );
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
