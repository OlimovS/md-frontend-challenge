import axios from "axios";
import {
  IUserEditableDataWithId,
  IUserPublicData,
  IUserswithIdandEmail,
} from "./types";

export const getUserEmails = () => {
  return axios.get<IUserswithIdandEmail>("/api/users").then((res) => res.data);
};

export const getUserData = (id: string) => {
  return axios.get<IUserPublicData>(`/api/user/${id}`).then((res) => res.data);
};

export const editUserData = (userData: IUserEditableDataWithId) => {
  return axios
    .patch<IUserPublicData>("/api/update-profile", userData)
    .then((res) => res.data);
};
