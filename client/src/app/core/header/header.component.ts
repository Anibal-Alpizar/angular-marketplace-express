import { Component } from '@angular/core';
import { DarkModeService } from 'src/app/share/dark-mode.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isDarkMode = false;
  constructor(private darkModeService: DarkModeService) {
    this.isDarkMode = darkModeService.isDarkMode;
    this.darkModeService.darkModeUpdated.subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
