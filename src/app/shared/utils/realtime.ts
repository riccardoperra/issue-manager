import { Appwrite } from 'appwrite';
import { Observable } from 'rxjs';
import { RealtimeResponseEvent } from 'appwrite/src/sdk';

export function realtimeListener<T>(
  appwrite: Appwrite,
  channels: string | string[]
) {
  return new Observable<RealtimeResponseEvent<T>>((observer) => {
    return appwrite.subscribe<T>(channels, (callback) =>
      observer.next(callback)
    );
  });
}
