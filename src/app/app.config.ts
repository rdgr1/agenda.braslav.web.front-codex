import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './services/jwt.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator'
import { getPortuguesePaginatorIntl } from './services/MatPaginatorIntlPt'
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr, ToastrModule} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withHashLocation()), provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserAnimationsModule),importProvidersFrom(ToastrModule.forRoot(
      {
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      }
    )),provideAnimations(),provideToastr(),
  provideHttpClient(withFetch(),withInterceptors([jwtInterceptor])),
   {
      provide: MatPaginatorIntl,
      useValue: getPortuguesePaginatorIntl()
    }
  ]
};
