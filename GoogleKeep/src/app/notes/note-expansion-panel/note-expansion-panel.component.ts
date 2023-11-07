import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note-expansion-panel',
  templateUrl: './note-expansion-panel.component.html',
  styleUrls: ['./note-expansion-panel.component.scss'],
})
export class NoteExpansionPanelComponent implements AfterViewInit, OnInit {
  @ViewChild('panel') expansionPanel!: MatExpansionPanel;

  panel!: any;
  panelClose!: any;
  inputPlaceHolder: string = 'Take a note...';
  noteForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private noteService: NotesService
  ) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: new FormControl(),
      description: new FormControl(),
      reminder: new FormControl(),
    });
  }

  ngAfterViewInit(): void {
    this.panel = document.getElementById('note-expansion-panel');
    this.panelClose = document.getElementById('panel-close');
  }

  expandPanel(event: any) {
    this.inputPlaceHolder = 'Title';
    this.expansionPanel.open();
  }

  getReminderDate() {
    if (this.noteService.reminderData) {
      this.noteForm.get('reminder')?.patchValue(this.noteService.reminderData);
      return this.noteService.reminderData;
    }
    return null;
  }

  removeReminder() {
    this.noteForm.get('reminder')?.patchValue(null);
    this.noteService.reminderData = null;
  }

  addNote(form: any) {
    const noteData = form.value;
    console.log(form.value);

    // if (noteData.title != null || noteData.description != null) {
    //   this.httpService
    //     .post('/notes/', form.value, `Bearer ${this.cookie.getToken()}`)
    //     .subscribe((resp) => {
    //       complete: {
    //         const data = resp;
    //         this.noteService.setNoteToView(data.data);
    //       }
    //     });
    // }
    // this.noteForm.reset();
  }

  panelCloseBtn() {
    this.addNote(this.noteForm);
    this.expansionPanel.close();
  }

  @HostListener('click', ['$event'])
  hideExpansionPanel(event: any) {
    if (
      !this.panel?.contains(event.target) ||
      this.panelClose?.contains(event.target)
    ) {
      this.inputPlaceHolder = 'Take a note...';
      this.addNote(this.noteForm);
      this.expansionPanel.close();
    }
  }
}
