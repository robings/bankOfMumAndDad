import { IAccount } from "../../Interfaces/Entities/IAccount";
import Loader from "../Loader/Loader";
import appStrings from "../../constants/app.strings";
import appliedClasses from "../../constants/appliedClasses";

interface IAccountsListProps {
  accountsData: IAccount[];
  accountsError: boolean;
  accountsLoading: boolean;
  onDelete: (id: number | null) => void;
  onViewTransactions: (id: number | null) => void;
}

function AccountsList(props: IAccountsListProps): JSX.Element {
  const {
    accountsData: data,
    accountsError: error,
    accountsLoading: loading,
    onDelete,
    onViewTransactions,
  } = props;

  return (
    <>
      {loading && !error ? (
        <Loader />
      ) : (
        <table className="hoverRow">
          <thead>
            <tr>
              <th>{appStrings.accounts.listTableHeaders.lastName}</th>
              <th>{appStrings.accounts.listTableHeaders.firstName}</th>
              <th className="currencyHeader">
                {appStrings.accounts.listTableHeaders.currentBalance}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, firstName, lastName, currentBalance }) => (
              <tr className="data" key={id}>
                <td>{lastName}</td>
                <td>{firstName}</td>
                {currentBalance < 0 ? (
                  <td className={appliedClasses.negativeAmount}>
                    -£{(currentBalance * -1).toFixed(2)}
                  </td>
                ) : (
                  <td className={appliedClasses.positiveAmount}>
                    £{currentBalance.toFixed(2)}
                  </td>
                )}
                <td>
                  <button
                    className="appButton thinnerButton"
                    onClick={() => onViewTransactions(id)}
                  >
                    {appStrings.accounts.listButtons.viewTransactions}
                  </button>
                  <button
                    className="appButton deleteButton thinnerButton"
                    onClick={() => onDelete(id)}
                  >
                    {appStrings.accounts.listButtons.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="error">{appStrings.accounts.error}</div>}
    </>
  );
}

export default AccountsList;
