import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { CookieService } from '../../services/cookie.service';
import { SideNavTogglerService } from '../../services/side-nav-toggler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('sideNavBar') sideMenuBar!: ElementRef;
  @Input() activeTab: string = 'keep';

  constructor(
    private togglerService: SideNavTogglerService,
    private cookie: CookieService,
    private router: Router
  ) {}

  // booleanValue$ = this.togglerService.booleanValue$;

  triggerToggleService() {
    this.togglerService.toggleBoolean();
  }

  logout() {
    this.cookie.deleteToken();
    this.router.navigate(['/login']);
  }
}
