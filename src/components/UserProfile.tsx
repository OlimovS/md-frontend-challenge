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
import { IUserEditableData, IUserPublicData } from "../helpers/types";
import { get_error_message, get_user_editable_data } from "../helpers/utils";
import { USER_EMAILS_QUERY_KEY, USER_QUERY_KEY } from "../helpers/constants";
import { editUserData, getUserData } from "../helpers/api";

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
          height="250"
          imageClassName="profile_picture"
        />
        <h4>{userData.name}</h4>
        <p>{userData.bio}</p>
        <p>{userData.email}</p>
        <Button
          label="Edit"
          icon="pi pi-pencil"
          data-testid="edit_button"
          onClick={() => setVisibilityEditModal((prev) => !prev)}
        />
        {/* modal, it won't appear as long as visible = false  */}
        <Dialog
          header="Edit profile data"
          visible={visibilityEditModal}
          className="edit_user_form_modal"
          onHide={hideModal}
          draggable={false}
        >
          {/* dialog content, includes: form, form submission button and modal close button */}
          <DialogContent
            userData={userData}
            hideModal={hideModal}
            formActions={
              <div className="edit_form_modal_actions">
                <Button type="submit" data-testid="save_form">
                  Save
                </Button>
                <Button type="button" severity="danger" onClick={hideModal}>
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
  name: yup
    .string()
    .required("Name must not be empty")
    .test(
      "space_characters",
      "name cannot have leading and ending space characters",
      (val) => val.trim().length === val.length
    ) // edge case where yup treats "     ", "  a  " as valid
    .min(2)
    .max(31),
  email: yup
    .string()
    .email()
    .min(4)
    .max(63)
    .required("email must not be empty"),
  bio: yup.string().max(255), // bio is not required
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
      <Form className="edit_form" data-testid="edit_form">
        <div className="form_field_wrap">
          <label className="field_label" htmlFor="name">
            Name*
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
            Email*
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
          <Field
            name="bio"
            component={TextareaComp}
            className="form_field"
            rows={4}
          />
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
