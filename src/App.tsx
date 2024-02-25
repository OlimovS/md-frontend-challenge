import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
// custom created (components | functions | css) imports
import UserProfile from "./components/UserProfile";
import { getUserEmails } from "./api";
import { USER_EMAILS_QUERY_KEY } from "./constants";
import { IUserswithIdandEmail } from "./types";
import "./App.css";
import { get_error_message } from "./utils";

// primereact's type for select option did not work.
// I had to write it.
interface ISelectOption {
  code: string;
  name: string;
}

const getSelectOptions = (
  users: IUserswithIdandEmail
): Array<ISelectOption> => {
  return users.map((u) => ({ name: u.email, code: u.id }));
};

function App() {
  const [selectedUser, setSelectedUser] = useState<ISelectOption>();

  const {
    data: emails,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: [USER_EMAILS_QUERY_KEY],
    queryFn: getUserEmails,
  });

  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Error occured: {get_error_message(error)}</p>;

  return (
    <div>
      {emails && (
        <Dropdown
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.value)}
          options={getSelectOptions(emails)}
          optionLabel="name"
          placeholder="Select a user"
          className="user_select"
        />
      )}

      {selectedUser && <UserProfile id={selectedUser.code} />}
    </div>
  );
}

export default App;
