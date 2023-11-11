import {
  AfterViewInit,
  AfterContentChecked,
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
  inputPlaceHolder!: string;
  noteForm!: FormGroup;
  noteImage!: File;

  constructor(
    private fb: FormBuilder,
    private noteService: NotesService,
    private cookie: CookieService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: new FormControl(),
      description: new FormControl(),
      remainder: new FormControl(),
    });

    this.inputPlaceHolder = 'Take a note...';
  }

  ngAfterViewInit(): void {
    this.panel = document.getElementById('note-expansion-panel');
    this.panelClose = document.getElementById('panel-close');
  }

  // ngAfterContentChecked(): void {
  //   this.inputPlaceHolder = 'Take a note...';
  // }

  expandPanel(event: any) {
    this.inputPlaceHolder = 'Title';
    this.expansionPanel.open();
  }

  getReminderDate() {
    if (this.noteService.reminderData) {
      this.noteForm.get('remainder')?.patchValue(this.noteService.reminderData);
      return this.noteService.reminderData;
    }
    return null;
  }

  removeReminder() {
    this.noteForm.get('remainder')?.patchValue(null);
    this.noteService.reminderData = null;
  }

  getImageData(data: any) {
    this.noteImage = data[0];
  }

  addNote(form: any) {
    const noteData = form.value;
    // const formData = new FormData();
    // Object.keys(noteData).forEach((key) => {
    //   formData.append(key, noteData[key]);
    // });
    // if (this.noteImage != undefined) {
    //   formData.append('image', this.noteImage, this.noteImage.name);
    // }

    if (noteData.title != null || noteData.description != null) {
      this.httpService
        .post('/notes/', noteData, `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          complete: {
            const data = resp;
            this.noteService.setNoteToView(data.data);
          }
        });
    }
    this.noteForm.reset();
    this.removeReminder();
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
