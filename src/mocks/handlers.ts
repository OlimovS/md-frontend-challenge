import { http, HttpHandler, HttpResponse } from "msw";
import { users } from "./data";
import { is_password_correct, jwt_sign } from "./auth";
import { ILoginCredentials, IUserEditableDataWithId } from "../types";
import { get_user_public_data } from "../utils";

export const handlers: Array<HttpHandler> = [
  http.get("/api/users", () => {
    return HttpResponse.json(users.map((u) => ({ email: u.email, id: u.id })));
  }),

  http.get("api/login", async (resolver) => {
    const userCredentials =
      (await resolver.request.json()) as ILoginCredentials;

    // are user credentials provided ?
    if (!(userCredentials.password && userCredentials.email)) {
      return new HttpResponse("Provide email and password!", { status: 400 });
    }

    // does the user exist in the db ?
    const user = users.find((u) => u.email === userCredentials.email);

    // the user does not exist in the db
    if (!user) {
      return new HttpResponse("No user found", { status: 404 });
    }

    // if user password is correct, sign jwt token
    if (is_password_correct(userCredentials.password, user.hash)) {
      return new HttpResponse(jwt_sign(), { status: 200 });
    }

    // if password is not correct
    return new HttpResponse("Wrong credentials!", { status: 401 });
  }),

  http.get("/api/user/:id", async (resolver) => {
    const { id } = resolver.params;

    const user = users.find((u) => u.id === id);
    // if no user is found
    if (!user) return new HttpResponse("User not found!", { status: 404 });

    return new HttpResponse(JSON.stringify(user));
  }),

  http.patch("/api/update-profile", async (resolver) => {
    // as it is a mock server, we won't do validation here
    // validation will be done in the frontend
    const reqBody = (await resolver.request.json()) as IUserEditableDataWithId;

    // finding the user from db
    const user_idx = users.findIndex((u) => u.id === reqBody.id);

    // checking if user exists in the db
    if (user_idx > -1) {
      // the user exists in the db, update user data and return updated user public data
      users[user_idx] = { ...users[user_idx], ...reqBody };
      return new Response(
        JSON.stringify(get_user_public_data(users[user_idx]))
      );
    }

    return new Response("No user found", { status: 404 });
  }),
];
