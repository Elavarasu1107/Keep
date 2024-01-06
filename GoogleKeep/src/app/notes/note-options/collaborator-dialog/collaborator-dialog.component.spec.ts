import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorDialogComponent } from './collaborator-dialog.component';

describe('CollaboratorDialogComponent', () => {
  let component: CollaboratorDialogComponent;
  let fixture: ComponentFixture<CollaboratorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollaboratorDialogComponent]
    });
    fixture = TestBed.createComponent(CollaboratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
