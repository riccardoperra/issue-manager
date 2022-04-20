import { InjectionToken } from '@angular/core';
import { Appwrite } from 'appwrite';
import { environment } from '../../environments/environment';

export const APPWRITE = new InjectionToken<Appwrite>('app write instance', {
  providedIn: 'root',
  factory: () => {
    const client = new Appwrite();
    client.setEndpoint(environment.appwriteEndpoint);
    client.setProject(environment.appwriteProject);
    return client;
  },
});
