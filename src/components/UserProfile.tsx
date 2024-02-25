import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import * as yup from "yup";
// primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/InputText";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
// custom
import { IUserEditableData, IUserPublicData } from "../types";
import { get_error_message, get_user_editable_data } from "../utils";
import { USER_EMAILS_QUERY_KEY, USER_QUERY_KEY } from "../constants";
import { editUserData, getUserData } from "../api";

interface IUserProfileProps {
  id: string;
}

function UserProfile(props: IUserProfileProps) {
  const { id } = props;
  const [visibilityEditModal, setVisibilityEditModal] = useState(false);

  const {
    data: userData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getUserData(id),
    queryKey: [USER_QUERY_KEY, id],
  });

  const hideModal = () => {
    setVisibilityEditModal(false);
  };

  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Error occured: {get_error_message(error)}</p>;

  if (userData) {
    return (
      <div className="profile_view">
        <Image
          src={userData.picture}
          alt={`profile image of ${userData.name}`}
          width="250"
          imageClassName="profile_picture"
        />
        <h4>{userData.name}</h4>
        <p>{userData.bio}</p>
        <p>{userData.email}</p>
        <Button
          label="Edit"
          icon="pi pi-pencil"
          onClick={() => setVisibilityEditModal((prev) => !prev)}
        />
        {/* modal, it won't appear as long as visible = false  */}
        <Dialog
          header="Edit profile data"
          visible={visibilityEditModal}
          style={{ width: "50vw" }}
          onHide={hideModal}
          draggable={false}
        >
          {/* dialog content, includes: form, form submission button and modal close button */}
          <DialogContent
            userData={userData}
            hideModal={hideModal}
            formActions={
              <div className="edit_form_modal_actions">
                <Button type="submit">Save</Button>
                <Button severity="danger" onClick={hideModal}>
                  Cancel
                </Button>
              </div>
            }
          />
        </Dialog>
      </div>
    );
  }

  return <p>Unexpected Error: Api did not return data</p>;
}

export default UserProfile;

/*
 *
 *
 * DialogContent related code
 *
 *
 */

// user edit form validation schema
const profileFormValidationSchema = yup.object().shape({
  name: yup.string().min(2).max(25).required("Name must not be empty"),
  email: yup
    .string()
    .email()
    .min(4)
    .max(35)
    .required("Email must not be empty"),
  bio: yup
    .string()
    .min(2)
    .max(127)
    .required("Bio must be between 2 and 127 characters"),
});

interface IDialogContentProps {
  userData: IUserPublicData;
  formActions: React.ReactNode;
  hideModal: () => void;
}

function DialogContent(props: IDialogContentProps) {
  const { userData, hideModal, formActions } = props;

  const userFormData = get_user_editable_data(userData);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: IUserEditableData) =>
      editUserData({ ...values, id: userData.id }),
    onSuccess: () => {
      // invalidating affected queries
      queryClient.invalidateQueries({
        queryKey: [USER_EMAILS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, userData.id],
      });

      // after saving user data and invalidating affected queries, hide modal
      hideModal();
    },
  });

  return (
    <Formik
      initialValues={userFormData}
      validationSchema={profileFormValidationSchema}
      onSubmit={(values) => {
        mutate(values);
      }}
    >
      <Form>
        <div className="form_field_wrap">
          <label className="field_label" htmlFor="name">
            Name
          </label>
          <Field name="name" component={InputComp} className="form_field" />
          <ErrorMessage
            component="p"
            name="name"
            className="form_field_error"
          />
        </div>

        <div className="form_field_wrap">
          <label className="field_label" htmlFor="email">
            Email
          </label>
          <Field
            type="email"
            name="email"
            placeholder="Email"
            component={InputComp}
            className="form_field"
          />
          <ErrorMessage
            component="p"
            name="email"
            className="form_field_error"
          />
        </div>

        <div className="form_field_wrap">
          <label className="field_label" htmlFor="bio">
            Bio
          </label>
          <Field name="bio" component={TextareaComp} className="form_field" />
          <ErrorMessage component="p" name="bio" className="form_field_error" />
        </div>
        {formActions}
      </Form>
    </Formik>
  );
}

// in-between component for formik and primereact InputText component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InputComp({ field, form, ...props }: FieldProps) {
  return <InputText {...field} {...props} />;
}

// in-between component for formik and primereact InputTextarea component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TextareaComp({ field, form, ...props }: FieldProps) {
  return <InputTextarea {...field} {...props} />;
}
