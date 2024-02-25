import { IUserEditableData, IUserFullData, IUserPublicData } from "./types";

/**
 * extract user public data from user data
 * @param {IUserFullData} user - user data.
 * @returns {IUserPublicData}
 */
export const get_user_public_data = (user: IUserFullData): IUserPublicData => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    bio: user.bio,
  };
};

/**
 * extract user public data from user data
 * @param {IUserFullData | IUserPublicData} user - user data.
 * @returns {IUserEditableData}
 */
export const get_user_editable_data = (
  user: IUserFullData | IUserPublicData
): IUserEditableData => {
  return {
    name: user.name,
    email: user.email,
    bio: user.bio,
  };
};

/**
 * gives us message of "unknown type" error
 * @param {unknown} error - error.
 * @returns {string}
 */
export const get_error_message = (error: unknown) => {
  return (error as Error)?.message || (error as Error)?.name || "";
};
