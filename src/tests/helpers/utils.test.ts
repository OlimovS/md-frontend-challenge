import {
  get_error_message,
  get_user_editable_data,
  get_user_public_data,
} from "../../helpers/utils";
import {
  error,
  error_message,
  userEditableData,
  userFullData,
  userPublicData,
} from "./helpers.mock";

describe("utils", () => {
  test("get_user_public_data returns public user data and does not return any private data", () => {
    expect(get_user_public_data(userFullData)).toEqual(userPublicData);
    expect(get_user_public_data(userFullData)).not.toHaveProperty("hash");
    expect(get_user_public_data(userFullData)).not.toHaveProperty("password");
  });

  test("get_error_message returns error message or error name", () => {
    expect(get_error_message(error)).toBe(error_message);
    expect(get_error_message({})).toBe("");
    expect(get_error_message({ name: "some error" })).toBe("some error");
  });

  test("get_user_editable_data returns editable data and does not return private data", () => {
    expect(get_user_editable_data(userFullData)).toEqual(userEditableData);
    expect(get_user_editable_data(userFullData)).not.toHaveProperty("hash");
    expect(get_user_editable_data(userFullData)).not.toHaveProperty("password");
  });
});
