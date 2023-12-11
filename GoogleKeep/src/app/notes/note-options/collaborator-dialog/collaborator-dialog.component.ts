import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from '../../../services/cookie.service';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-collaborator-dialog',
  templateUrl: './collaborator-dialog.component.html',
  styleUrls: ['./collaborator-dialog.component.scss'],
})
export class CollaboratorDialogComponent implements OnInit, OnDestroy {
  allUsers!: any[];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  collaborators: string[] = [];
  subscription = new Subscription();
  constructor(
    private httpService: HttpService,
    private cookie: CookieService,
    public dialogRef: MatDialogRef<CollaboratorDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public collabData: string[]
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.httpService
        .get(`/user/api/registration/`, `Bearer ${this.cookie.getToken()}`)
        .subscribe((resp) => {
          this.allUsers = resp.data;
        })
    );
  }

  filterCollaborators() {
    if (this.searchTerm != '') {
      this.filteredUsers = this.allUsers
        .filter((user) =>
          user.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
        .sort();
    } else {
      this.filteredUsers = [];
    }
  }

  addCollaborator(email: string) {
    if (this.allUsers.includes(email)) {
      this.collaborators.push(email);
      this.filteredUsers.splice(this.filteredUsers.indexOf(email), 1);
      this.searchTerm = '';
    }
  }

  removeCollaborator(email: string) {
    this.collaborators.splice(this.collaborators.indexOf(email), 1);
  }

  onClose() {
    this.dialogRef.close({ collaborators: this.collaborators });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
