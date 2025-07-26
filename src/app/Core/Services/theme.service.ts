import { Injectable, computed, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';
  private themeSignal = signal<Theme>(
    (localStorage.getItem(this.THEME_KEY) as Theme) || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  
  theme = this.themeSignal.asReadonly();
  isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const theme = this.theme();
      localStorage.setItem(this.THEME_KEY, theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    });
  }

  toggleTheme() {
    this.themeSignal.update(current => current === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }
}
