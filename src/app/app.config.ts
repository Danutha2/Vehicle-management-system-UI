// src/app/app.config.ts
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideApollo(() => {
      const httpClient = inject(HttpClient); 
      const httpLink = new HttpLink(httpClient); 

      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:3010/graphql',
        }),
      };
    }),
  ],
};
