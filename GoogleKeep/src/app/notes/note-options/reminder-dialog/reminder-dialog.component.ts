import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: './reminder-dialog.component.html',
  styleUrls: ['./reminder-dialog.component.scss'],
})
export class ReminderDialogComponent {
  inputReminderData = new FormControl();
  subscription = new Subscription();
  constructor(private noteService: NotesService) {
    this.inputReminderData.valueChanges.subscribe((value) => {
      if (this.noteService.noteId === undefined) {
        this.subscription.add(this.noteService.setReminderForNotes(value));
        return;
      }
      this.subscription.add(
        this.noteService.updateReminderForNotes(this.noteService.noteId, value)
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
