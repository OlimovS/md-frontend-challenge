import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import App from "../../App";
import { users } from "../../mock-server/data";
import { UI_TEST_IDS } from "../../helpers/constants";
import * as api from "../../helpers/api";
import { IUserswithIdandEmail } from "../../helpers/types";

const queryClient = new QueryClient({});

function make_mock_getUserEmails(data: IUserswithIdandEmail) {
  return jest
    .spyOn(api, "getUserEmails")
    .mockResolvedValue(Promise.resolve(data));
}

describe("App component", () => {
  // mocking axiosget all users email and id data
  test("full app flow test: from rendering to updated profile", async () => {
    let mocked_getUserEmails = make_mock_getUserEmails(users);
    const user = users[0];

    // mocking getUserData
    const mocked_getUserData = jest
      .spyOn(api, "getUserData")
      .mockReturnValue(Promise.resolve(user));

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // see if select component is in the document
    const select_component = await waitFor(() =>
      screen.getByTestId(UI_TEST_IDS.user_select_dropdown)
    );
    expect(select_component).toBeInTheDocument();

    // clicking the select component and seeing if user email appear on the screen
    fireEvent.click(select_component);

    const select_option = screen.getByText(user.email);
    expect(select_option).toBeInTheDocument();

    // clicking the select option should render the profile_view_wrap div
    fireEvent.click(select_option);
    const profile_view_wrap = await screen.findByTestId(
      UI_TEST_IDS.profile_view_wrap
    );
    expect(profile_view_wrap).toBeInTheDocument();
    expect(mocked_getUserData).toHaveBeenCalledTimes(1);

    // user profile view and user name is expected to be rendered
    const user_profile_view = await screen.findByTestId(
      UI_TEST_IDS.user_profile_view
    );
    expect(user_profile_view).toBeInTheDocument();

    const user_name = await screen.findByTestId(UI_TEST_IDS.user_name);
    expect(user_name).toBeInTheDocument();

    // clicking edit button should open the modal
    const edit_button = await screen.findByTestId(UI_TEST_IDS.edit_button);
    fireEvent.click(edit_button);

    // edit form and email input should be rendered
    const edit_user_form = await screen.findByTestId(
      UI_TEST_IDS.edit_user_form
    );
    expect(edit_user_form).toBeInTheDocument();

    const email_input = await screen.findByPlaceholderText(
      UI_TEST_IDS.email_placeholder
    );
    expect(email_input).toBeInTheDocument();

    // updating the email input should work
    const new_email = "alkidplstest11223344@test9843m.com"; // making a unique email that won't appear in the db
    fireEvent.change(email_input, { target: { value: new_email } });

    // new email value should be in the document
    expect(await screen.findByDisplayValue(new_email)).toBeInTheDocument();

    // finding the save button
    const save_form_button = await screen.findByTestId(
      UI_TEST_IDS.save_form_button
    );

    const updated_user = { ...user, email: new_email };

    // mocking api functions
    const mocked_editUserData = jest
      .spyOn(api, "editUserData")
      .mockReturnValue(Promise.resolve(updated_user));

    mocked_getUserEmails = make_mock_getUserEmails(
      users.map((u) => {
        if (u.id === updated_user.id) {
          return { id: u.id, email: updated_user.email };
        }
        return { id: u.id, email: u.email };
      })
    );

    // clearing mocked api before being called again
    mocked_getUserData.mockClear();

    // clicking the save button
    await waitFor(() => {
      fireEvent.click(save_form_button);
    });

    // api calls should be made
    expect(mocked_editUserData).toHaveBeenCalled();
    expect(mocked_getUserEmails).toHaveBeenCalled();
    expect(mocked_getUserData).toHaveBeenCalled();

    // user email should be updated
    const user_email = await screen.findByTestId(UI_TEST_IDS.user_email);
    expect(user_email.textContent).toBe(user.email);
  });
});
