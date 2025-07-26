import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitService {
  constructor(private themeService: ThemeService) {}

  initializeTheme() {
    // Apply the theme from local storage or system preference
    const theme = localStorage.getItem('theme-preference') as 'light' | 'dark' || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    this.themeService.setTheme(theme);
    
    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme-preference')) {
        this.themeService.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
