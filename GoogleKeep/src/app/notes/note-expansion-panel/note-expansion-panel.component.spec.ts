import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteExpansionPanelComponent } from './note-expansion-panel.component';

describe('NoteExpansionPanelComponent', () => {
  let component: NoteExpansionPanelComponent;
  let fixture: ComponentFixture<NoteExpansionPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteExpansionPanelComponent]
    });
    fixture = TestBed.createComponent(NoteExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
