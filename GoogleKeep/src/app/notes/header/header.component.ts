import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Renderer2,
} from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { SideNavTogglerService } from '../../services/side-nav-toggler.service';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('sideNavBar') sideMenuBar!: ElementRef;
  @ViewChild('refreshBtn') refreshBtn!: ElementRef;
  @Input() activeTab: string = 'keep';
  searchInput!: string;

  constructor(
    private togglerService: SideNavTogglerService,
    private cookie: CookieService,
    private router: Router,
    private noteService: NotesService,
    private renderer: Renderer2,
    private activeRoute: ActivatedRoute
  ) {}

  // booleanValue$ = this.togglerService.booleanValue$;

  searchNote() {
    this.noteService.searchNotes(this.searchInput);
  }

  refreshNotes(event: Event) {
    let ele = this.refreshBtn.nativeElement as HTMLElement;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.renderer.addClass(ele, 'roateRefreshIcon');
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.renderer.removeClass(ele, 'roateRefreshIcon');
      }
    });
    this.router.navigateByUrl(this.router.url);
  }

  triggerToggleService() {
    this.togglerService.toggleBoolean();
  }

  logout() {
    this.cookie.deleteToken();
    this.router.navigate(['/login']);
  }
}
