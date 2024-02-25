/*
 * User types
 */
export interface IUserFullData {
  id: string;
  name: string;
  email: string;
  picture: string;
  bio: string;
  password: string;
  hash: string;
}

export interface IUserPublicData {
  id: string;
  name: string;
  email: string;
  picture: string;
  bio: string;
}

export type IUserEditableData = Omit<IUserPublicData, "id">;

export type IUserEditableDataWithId = IUserEditableData &
  Pick<IUserPublicData, "id">;

/*
 * Auth types
 */

export interface ILoginCredentials {
  email: string;
  password: string;
}
