import Loader from "../Loader/Loader";
import appStrings from "../../constants/app.strings";
import appliedClasses from "../../constants/appliedClasses";
import { IListOfTransactionsForAccount } from "../../Interfaces/Entities/ITransaction";

export interface ITransactionProps {
  data: IListOfTransactionsForAccount;
  error: boolean;
  loading: boolean;
}

function Transactions(props: ITransactionProps): JSX.Element {
  const { data, error, loading } = props;

  return (
    <main>
      {loading && !error ? (
        <Loader />
      ) : (
        <div>
          <h3>
            Name: {data.firstName} {data.lastName}
          </h3>

          <table>
            <thead>
              <tr>
                <th>{appStrings.transactions.listTableHeaders.date}</th>
                <th style={{ textAlign: "center" }}>
                  {appStrings.transactions.listTableHeaders.deposits}
                </th>
                <th style={{ textAlign: "center" }}>
                  {appStrings.transactions.listTableHeaders.withdrawals}
                </th>
                <th style={{ textAlign: "center" }}>
                  {appStrings.transactions.listTableHeaders.balance}
                </th>
                <th>{appStrings.transactions.listTableHeaders.comments}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{appStrings.transactions.startBalance}</td>
                <td></td>
                <td></td>
                {data.openingBalance < 0 ? (
                  <td className={appliedClasses.negativeAmount}>
                    -£{(data.openingBalance * -1).toFixed(2)}
                  </td>
                ) : (
                  <td className={appliedClasses.positiveAmount}>
                    £{data.openingBalance.toFixed(2)}
                  </td>
                )}
                <td></td>
              </tr>
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5}>{appStrings.transactions.noTransactions}</td>
                </tr>
              ) : (
                data.transactions.map(
                  ({ amount, date, type, comments, balance }, index) => (
                    <tr key={index}>
                      <td className="date">{date}</td>
                      <td
                        className={`currency ${appliedClasses.positiveAmount}`}
                      >
                        {type === 0 ? `£${amount.toFixed(2)}` : ""}
                      </td>
                      <td
                        className={`currency ${appliedClasses.negativeAmount}`}
                      >
                        {type === 0 ? "" : `£${amount.toFixed(2)}`}
                      </td>
                      {balance < 0 ? (
                        <td
                          className={`currency ${appliedClasses.negativeAmount}`}
                        >
                          -£{(balance * -1).toFixed(2)}
                        </td>
                      ) : (
                        <td
                          className={`currency ${appliedClasses.positiveAmount}`}
                        >
                          £{balance.toFixed(2)}
                        </td>
                      )}
                      <td className="comments">{comments}</td>
                    </tr>
                  )
                )
              )}
              <tr>
                <td>{appStrings.transactions.endBalance}</td>
                <td></td>
                <td></td>
                {data.currentBalance < 0 ? (
                  <td className={appliedClasses.negativeAmount}>
                    -£{(data.currentBalance * -1).toFixed(2)}
                  </td>
                ) : (
                  <td className={appliedClasses.positiveAmount}>
                    £{data.currentBalance.toFixed(2)}
                  </td>
                )}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Transactions;
