import appStrings from "../../constants/app.strings";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { INewAccountFormInput } from "../../Interfaces/INewAccountForm";
import appliedClasses from "../../constants/appliedClasses";

const newAccountSchema = yup.object().shape({
  firstName: yup.string().required(appStrings.accounts.newForm.firstNameError),
  lastName: yup.string().required(appStrings.accounts.newForm.lastNameError),
  openingBalance: yup
    .number()
    .typeError(appStrings.accounts.newForm.openingBalanceError)
    .required(appStrings.accounts.newForm.openingBalanceError),
});

export interface NewAccountFormProps {
  closeModal(): void;
  onSave: (data: INewAccountFormInput) => void;
}

const determineInputBorderClass = (
  error: boolean,
  touched: boolean,
  dirty: boolean,
  isValid: boolean
) => {
  if (touched && error) {
    return appliedClasses.errorBorder;
  }

  if (touched && !error) {
    return appliedClasses.validBorder;
  }

  if (dirty && isValid) {
    return appliedClasses.validBorder;
  }

  return "";
};

function AccountsNewForm(props: NewAccountFormProps): JSX.Element {
  const initialValues: INewAccountFormInput = {
    firstName: "",
    lastName: "",
    openingBalance: "0",
  };

  const { closeModal, onSave } = props;

  return (
    <div className="overlay">
      <div className="modal">
        <button className="appButton closeButton" onClick={closeModal}>
          {appStrings.closeButton}
        </button>
        <h1>{appStrings.accounts.newForm.title}</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={newAccountSchema}
          onSubmit={(values) => onSave(values)}
        >
          {({ isValid, dirty, touched, errors }) => (
            <Form>
              <div>
                <label htmlFor="firstName">
                  {appStrings.accounts.newForm.firstName}
                </label>
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  className={determineInputBorderClass(
                    errors.firstName ? true : false,
                    touched.firstName ?? false,
                    dirty,
                    isValid
                  )}
                />
              </div>
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
              <div>
                <label htmlFor="lastName">
                  {appStrings.accounts.newForm.lastName}
                </label>
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  className={determineInputBorderClass(
                    errors.lastName ? true : false,
                    touched.lastName ?? false,
                    dirty,
                    isValid
                  )}
                />
              </div>
              <ErrorMessage name="lastName" component="div" className="error" />
              <div>
                <label htmlFor="openingBalance">
                  {appStrings.accounts.newForm.openingBalance}
                </label>
                <Field
                  type="text"
                  name="openingBalance"
                  id="openingBalance"
                  className={`numberField ${determineInputBorderClass(
                    errors.openingBalance ? true : false,
                    touched.openingBalance ?? false,
                    dirty,
                    isValid
                  )}`}
                />
              </div>
              <ErrorMessage
                name="openingBalance"
                component="div"
                className="error"
              />
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
