import { IUserFullData, IUserPublicData } from "./types";

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
    bio: user.picture,
  };
};
