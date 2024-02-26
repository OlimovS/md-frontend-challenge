import axios from "axios";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import App from "../../App";
import { users } from "../../mock-server/data";

const queryClient = new QueryClient();

jest.mock("axios");

describe("App component", () => {
  // mocking axiosget all users email and id data
  (axios.get as jest.Mock).mockResolvedValue({ data: users });

  test("ui is rendered and selecting email should render provile view", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // see if select component is in the document
    const select_component = await waitFor(() =>
      screen.getByTestId("user_select_list")
    );
    expect(select_component).toBeInTheDocument();

    // clicking the select component and seeing if user email appear on the screen
    fireEvent.click(select_component);

    const user = users[0];

    const select_option = screen.getByText(user.email);
    expect(select_option).toBeInTheDocument();

    // clicking the select option should render the profile_view_wrap div
    fireEvent.click(select_option);
    const profile_view_wrap = await screen.findByTestId("profile_view_wrap");
    expect(profile_view_wrap).toBeInTheDocument();
  });
});
