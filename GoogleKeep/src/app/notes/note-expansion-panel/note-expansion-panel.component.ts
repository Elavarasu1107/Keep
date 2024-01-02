import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { HttpService } from '../../services/http.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-note-expansion-panel',
  templateUrl: './note-expansion-panel.component.html',
  styleUrls: ['./note-expansion-panel.component.scss'],
})
export class NoteExpansionPanelComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('panel') expansionPanel!: MatExpansionPanel;

  panel!: any;
  panelClose!: any;
  inputPlaceHolder!: string;
  noteForm!: FormGroup;
  noteImage!: File | undefined;
  subscription = new Subscription();
  hidePanelIcons: boolean = false;
  noteColor: string | null = null;

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
      is_archive: new FormControl(false),
      collaborator: this.fb.array([]),
      label: this.fb.array([]),
      color: new FormControl(),
    });

    this.inputPlaceHolder = 'Take a note...';
  }

  ngAfterViewInit(): void {
    this.panel = document.getElementById('note-expansion-panel');
    this.panelClose = document.getElementById('panel-close');
  }

  expandPanel(event: any) {
    this.inputPlaceHolder = 'Title';
    this.hidePanelIcons = true;
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

  archiveWhileCreation(data: any) {
    this.noteForm.get('is_archive')?.patchValue(data);
  }

  getCollaborators() {
    return this.noteService.collaborators;
  }

  getLabels() {
    return this.noteService.noteLabels;
  }

  removeCollaborator(email: string) {
    this.noteService.collaborators.splice(
      this.noteService.collaborators.indexOf(email),
      1
    );
  }

  removeLabels(label: string) {
    this.noteService.noteLabels.splice(
      this.noteService.noteLabels.indexOf(label),
      1
    );
  }

  addNote() {
    let data!: any;
    const collaborators = this.noteForm.get('collaborator') as FormArray;
    const label = this.noteForm.get('label') as FormArray;
    this.noteService.collaborators.forEach((email) => {
      collaborators.push(new FormControl(email));
    });
    this.noteService.noteLabels.forEach((item) => {
      label.push(new FormControl(item));
    });

    this.noteForm.get('color')?.patchValue(this.noteColor);
    data = this.noteForm.value;

    if (this.noteImage != undefined) {
      const formData = new FormData();
      Object.keys(this.noteForm.value).forEach((key) => {
        formData.append(key, this.noteForm.value[key]);
      });
      formData.append('image', this.noteImage, this.noteImage.name);
      data = formData;
    }
    if (
      ![null, undefined, ''].includes(this.noteForm.value.title) ||
      ![null, undefined, ''].includes(this.noteForm.value.description)
    ) {
      this.subscription.add(
        this.httpService
          .post(environment.notesUrl, data, `Bearer ${this.cookie.getToken()}`)
          .subscribe((resp) => {
            complete: {
              const data = resp;
              this.noteService.setNoteToView(data.data);
            }
          })
      );
      this.noteForm.reset({ is_archive: false });
      collaborators.clear();
      label.clear();
      this.noteService.noteLabels = [];
      this.noteService.collaborators = [];
      this.removeReminder();
      this.noteImage = undefined;
      this.noteColor = null;
    }
  }

  hideExpansionPanel(event: any) {
    this.inputPlaceHolder = 'Take a note...';
    this.addNote();
    this.expansionPanel.close();
    this.hidePanelIcons = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
