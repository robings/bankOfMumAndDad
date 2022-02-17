import appStrings from "../../constants/app.strings";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import * as yup from "yup";
import { INewAccountFormInput } from "../../Interfaces/INewAccountForm";
import appliedClasses from "../../constants/appliedClasses";

const newAccountSchema = yup.object().shape({
  firstName: yup.string().required(appStrings.accounts.newForm.firstNameError),
  lastName: yup.string().required(appStrings.accounts.newForm.lastNameError),
  openingBalance: yup
    .number()
    .typeError(appStrings.accounts.newForm.openingBalanceError)
    .required(appStrings.accounts.newForm.openingBalanceRequired),
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

const showErrorBox = (
  errors: FormikErrors<INewAccountFormInput>,
  touched: FormikTouched<INewAccountFormInput>
): boolean => {
  if (
    (errors.firstName && touched.firstName) ||
    (errors.lastName && touched.lastName) ||
    (errors.openingBalance && touched.openingBalance)
  ) {
    return true;
  }

  return false;
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
              {showErrorBox(errors, touched) && (
                <div className="errorBox">
                  <h4>{appStrings.errorBoxTitle}</h4>
                  <ul>
                    <ErrorMessage name="firstName" component="li" />
                    <ErrorMessage name="lastName" component="li" />
                    <ErrorMessage name="openingBalance" component="li" />
                  </ul>
                </div>
              )}
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
