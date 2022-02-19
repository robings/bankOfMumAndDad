import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import appStrings from "../../constants/app.strings";
import { INewTransactionFormInput } from "../../Interfaces/INewTransactionForm";

interface INewTransactionFormProps {
  closeModal: () => void;
  onSave: (transaction: INewTransactionFormInput) => void;
}

function TransactionsNewForm(props: INewTransactionFormProps): JSX.Element {
  const { closeModal, onSave } = props;

  const initialValues: INewTransactionFormInput = {
    amount: "",
    dateOfTransaction: "",
    type: "DEPOSIT",
    comments: "",
  };

  const NewTransactionSchema = yup.object().shape({
    amount: yup.number().required(),
    dateOfTransaction: yup.date().required(),
    type: yup.string().required(),
    comments: yup.string(),
  });

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
          {({ isValid, dirty }) => (
            <Form>
              <div>
                <label htmlFor="amount">
                  {appStrings.transactions.newForm.amount}
                </label>
                <Field type="text" name="amount" id="amount" />
              </div>
              <div>
                <label htmlFor="dateOfTransaction">
                  {appStrings.transactions.newForm.date}
                </label>
                <Field
                  type="date"
                  name="dateOfTransaction"
                  id="dateOfTransaction"
                />
              </div>
              <div>
                <label htmlFor="type">
                  {appStrings.transactions.newForm.type}
                </label>
                <Field as="select" name="type" id="type">
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
                <Field type="text" name="comments" id="comments" />
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
