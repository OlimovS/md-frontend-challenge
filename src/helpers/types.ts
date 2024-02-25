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

export type IUserEditableData = Omit<IUserPublicData, "id" | "picture">;

export type IUserEditableDataWithId = IUserEditableData &
  Pick<IUserPublicData, "id">;

export type IUserswithIdandEmail = Array<Pick<IUserPublicData, "id" | "email">>;
