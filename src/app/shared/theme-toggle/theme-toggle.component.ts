import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../Core/Services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggleTheme()"
      class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      [title]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <ng-container *ngIf="isDark(); else lightIcon">
        <i class="fas fa-sun text-yellow-400"></i>
      </ng-container>
      <ng-template #lightIcon>
        <i class="fas fa-moon text-gray-700 dark:text-gray-300"></i>
      </ng-template>
    </button>
  `,
  styles: []
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
