import { INewAccountFormProps } from "../../Interfaces/INewAccountForm";
import appStrings from "../../constants/app.strings";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";

const newAccountSchema = yup.object().shape({
  firstName: yup.string().required("Please enter a first name."),
  lastName: yup.string().required("Please enter a last name."),
  openingBalance: yup.number(),
});

function AccountsNewForm(props: INewAccountFormProps): JSX.Element {
  const initialValues = {
    firstName: "",
    lastName: "",
    openingBalance: 0,
  };

  // async function submitNewAccount(newAccountFormInput: INewAccountFormInput) {
  //   const data: any = {
  //     firstName: newAccountFormInput.firstName,
  //     lastName: newAccountFormInput.lastName,
  //     openingBalance: newAccountFormInput.openingBalance,
  //     currentBalance: newAccountFormInput.openingBalance,
  //   };

  //   try {
  //     await apiAccounts.saveNewAccount(data);
  //     props.closeModal();
  //   } catch {}
  // }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="appButton closeButton" onClick={props.closeModal}>
          {appStrings.closeButton}
        </button>
        <h1>{appStrings.accounts.newForm.title}</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={newAccountSchema}
          onSubmit={() => {}}
        >
          {({ isValid, dirty, touched }) => (
            <Form>
              <div>
                <label htmlFor="firstName">
                  {appStrings.accounts.newForm.firstName}
                </label>
                <Field type="text" name="firstName" id="firstName" />
              </div>
              {touched.firstName && (
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="error"
                />
              )}
              <div>
                <label htmlFor="lastName">
                  {appStrings.accounts.newForm.lastName}
                </label>
                <Field type="text" name="lastName" id="lastName" />
              </div>
              {touched.lastName && (
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="error"
                />
              )}
              <div>
                <label htmlFor="openingBalance">
                  {appStrings.accounts.newForm.openingBalance}
                </label>
                <Field
                  type="number"
                  name="openingBalance"
                  id="openingBalance"
                />
              </div>
              <button
                className="appButton"
                type="submit"
                disabled={!dirty || !isValid}
              >
                {appStrings.submit}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AccountsNewForm;
