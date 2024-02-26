import axios from "axios";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import UserProfile from "../../components/UserProfile";
import { users } from "../../mock-server/data";
import { UI_TEST_IDS } from "../../helpers/constants";

const queryClient = new QueryClient();

jest.mock("axios");

const user = users[1];

describe("UserProfile component", () => {
  // mocking axiosget all users email and id data
  (axios.get as jest.Mock).mockResolvedValue({ data: user });

  test("ui is rendered and selecting email should render provile view", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile id={user.id} />
      </QueryClientProvider>
    );

    // after fetching is done, check if user.name is in the document
    expect(await screen.findByText(user.name)).toBeInTheDocument();

    // check if edit button is in the document.
    const edit_button = screen.getByTestId(UI_TEST_IDS.edit_button);
    expect(edit_button).toBeInTheDocument();

    // clicking edit button should open the modal
    fireEvent.click(edit_button);

    const form_elem = screen.getByTestId(UI_TEST_IDS.edit_user_form);
    expect(form_elem).toBeInTheDocument();

    // let's change the email and see if it changes
    const email_elem = screen.getByPlaceholderText(
      UI_TEST_IDS.email_placeholder
    );
    const new_email = "test.a1111@email.com";
    fireEvent.change(email_elem, {
      target: { value: new_email },
    });
    const new_email_elem = await screen.findByDisplayValue(new_email);
    expect(new_email_elem).toBeInTheDocument();
  });
});
