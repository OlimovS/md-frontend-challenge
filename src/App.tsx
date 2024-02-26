import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useQuery } from "react-query";
// custom created (components | functions | css) imports
import UserProfile from "./components/UserProfile";
import { getUserEmails } from "./helpers/api";
import { USER_EMAILS_QUERY_KEY } from "./helpers/constants";
import { IUserswithIdandEmail } from "./helpers/types";
import "./App.css";
import { get_error_message } from "./helpers/utils";

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
    data: userEmailAndIdList,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: [USER_EMAILS_QUERY_KEY],
    queryFn: getUserEmails,
    // list is same as userEmailAndIdList. But onSuccess lets us update selectedUser whenever we get the list from the server
    onSuccess: (list) => {
      //  in case selectedUser is holding old user email, we need to update it
      setSelectedUser((prevSelected): ISelectOption | undefined => {
        let user;
        // if there is prevSelected and
        // if the same user is in the list and
        // if email needs updating
        // update email in the selectedUser
        if (
          prevSelected &&
          (user = list.find((u) => u.id === prevSelected.code)) &&
          user.email !== prevSelected.name
        ) {
          return { ...prevSelected, name: user.email };
        }

        // otherwise return prevSelected
        return prevSelected;
      });
    },
  });

  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Error occured: {get_error_message(error)}</p>;

  return (
    <div>
      {userEmailAndIdList && (
        <Dropdown
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.value)}
          options={getSelectOptions(userEmailAndIdList)}
          optionLabel="name"
          placeholder="Select a user"
          className="user_select"
          data-testid="user_select_list"
        />
      )}

      {selectedUser && (
        <div className="profile_view_wrap" data-testid="profile_view_wrap">
          <UserProfile id={selectedUser.code} />
        </div>
      )}
    </div>
  );
}

export default App;
