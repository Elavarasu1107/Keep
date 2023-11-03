import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-note-expansion-panel',
  templateUrl: './note-expansion-panel.component.html',
  styleUrls: ['./note-expansion-panel.component.scss'],
})
export class NoteExpansionPanelComponent implements AfterViewInit {
  @ViewChild('panel') expansionPanel!: MatExpansionPanel;
  @ViewChild('panel', { read: ElementRef }) expansionPanelRef!: ElementRef;

  panel!: any;
  panelClose!: any;
  inputPlaceHolder!: string;

  ngAfterViewInit(): void {
    this.panel = document.getElementById('note-expansion-panel');
    this.panelClose = document.getElementById('panel-close');
    this.inputPlaceHolder = 'Take a note...';
  }

  expandPanel(event: any) {
    this.inputPlaceHolder = 'Title';
    this.expansionPanel.open();
  }

  @HostListener('click', ['$event'])
  hideExpansionPanel(event: any) {
    if (
      !this.panel?.contains(event.target) ||
      this.panelClose?.contains(event.target)
    ) {
      this.inputPlaceHolder = 'Take a note...';
      this.expansionPanel.close();
    }
  }
}
