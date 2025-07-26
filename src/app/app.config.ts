import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { ThemeInitService } from './Core/Services/theme-init.service';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: 'APP_INITIALIZER',
      useFactory: () => {
        const themeInitService = inject(ThemeInitService);
        return () => themeInitService.initializeTheme();
      },
      multi: true,
    },
    provideHttpClient(),
    provideAnimations()
  ]
};
