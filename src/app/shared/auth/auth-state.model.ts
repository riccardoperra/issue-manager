import { Models } from 'appwrite';

export interface AuthStateModel {
  account: Models.User<{
    guest?: boolean;
  }> | null;
  session: Models.Session | null;
  teams: Models.Team[] | null;
}
