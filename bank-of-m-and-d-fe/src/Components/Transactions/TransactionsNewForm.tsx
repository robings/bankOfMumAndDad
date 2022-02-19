import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import * as yup from "yup";
import appStrings from "../../constants/app.strings";
import appliedClasses from "../../constants/appliedClasses";
import { INewTransactionFormInput } from "../../Interfaces/INewTransactionForm";

interface INewTransactionFormProps {
  closeModal: () => void;
  onSave: (transaction: INewTransactionFormInput) => void;
}

const NewTransactionSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError(appStrings.transactions.newForm.amountError)
    .required(appStrings.transactions.newForm.amountRequired),
  dateOfTransaction: yup
    .date()
    .required(appStrings.transactions.newForm.dateRequired),
  type: yup.string().required(),
  comments: yup.string(),
});

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

const determineInputBorderClassWithWarning = (
  dirty: boolean,
  touched: boolean,
  value: string
) => {
  if ((dirty || touched) && value) {
    return appliedClasses.validBorder;
  }

  if ((dirty || touched) && !value) {
    return "warningBorder";
  }

  return "";
};

const showErrorBox = (
  errors: FormikErrors<INewTransactionFormInput>,
  touched: FormikTouched<INewTransactionFormInput>
): boolean => {
  if (
    (errors.amount && touched.amount) ||
    (errors.dateOfTransaction && touched.dateOfTransaction)
  ) {
    return true;
  }

  return false;
};

function TransactionsNewForm(props: INewTransactionFormProps): JSX.Element {
  const { closeModal, onSave } = props;

  const initialValues: INewTransactionFormInput = {
    amount: "",
    dateOfTransaction: "",
    type: "DEPOSIT",
    comments: "",
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="appButton closeButton" onClick={closeModal}>
          {appStrings.closeButton}
        </button>
        <h1>{appStrings.transactions.newForm.title}</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => onSave(values)}
          validationSchema={NewTransactionSchema}
        >
          {({ isValid, dirty, touched, errors, values }) => (
            <Form>
              {showErrorBox(errors, touched) && (
                <div className="errorBox">
                  <h4>{appStrings.errorBoxTitle}</h4>
                  <ul>
                    <ErrorMessage name="amount" component="li" />
                    <ErrorMessage name="dateOfTransaction" component="li" />
                  </ul>
                </div>
              )}
              <div>
                <label htmlFor="amount">
                  {appStrings.transactions.newForm.amount}
                </label>
                <Field
                  type="text"
                  name="amount"
                  id="amount"
                  className={determineInputBorderClass(
                    errors.amount ? true : false,
                    touched.amount ?? false,
                    dirty,
                    isValid
                  )}
                />
              </div>
              <div>
                <label htmlFor="dateOfTransaction">
                  {appStrings.transactions.newForm.date}
                </label>
                <Field
                  type="date"
                  name="dateOfTransaction"
                  id="dateOfTransaction"
                  className={determineInputBorderClass(
                    errors.dateOfTransaction ? true : false,
                    touched.dateOfTransaction ?? false,
                    dirty,
                    isValid
                  )}
                />
              </div>
              <div>
                <label htmlFor="type">
                  {appStrings.transactions.newForm.type}
                </label>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className={
                    (dirty || touched.type) && appliedClasses.validBorder
                  }
                >
                  <option value="deposit">
                    {appStrings.transactions.newForm.typeOptions.deposit}
                  </option>
                  <option value="withdrawal">
                    {appStrings.transactions.newForm.typeOptions.withdrawal}
                  </option>
                </Field>
              </div>
              <div>
                <label htmlFor="comments">
                  {appStrings.transactions.newForm.comments}
                </label>
                <Field
                  type="text"
                  name="comments"
                  id="comments"
                  className={determineInputBorderClassWithWarning(
                    dirty,
                    touched.comments ?? false,
                    values.comments
                  )}
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

export default TransactionsNewForm;
