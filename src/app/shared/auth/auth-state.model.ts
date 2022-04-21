import { Models } from 'appwrite';

export interface AuthStateModel {
  account: Models.User<{}> | null;
  session: Models.Session | null;
}
