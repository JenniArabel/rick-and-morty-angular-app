import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Global error handling
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimized change detection
    provideRouter(routes), // Router configuration
    provideHttpClient(), // HTTP client for API calls

    //HashStrategy
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
};
