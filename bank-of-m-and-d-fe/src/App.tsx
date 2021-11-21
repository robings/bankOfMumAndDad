import LoginPage from './LoginPage';
import AccountsPage from './AccountsPage';
import TransactionsPage from './TransactionsPage';
import { Route, Switch } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header/Header';

function App(): JSX.Element {
    return (
        <>
            <Header />
            <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route path="/accounts" component={AccountsPage} />
                <Route path="/transactions/:accountId" component={TransactionsPage} />
                <Route component={LoginPage} />
            </Switch>
            <ToastContainer transition={Slide}/>
        </>
    );
}

export default App;
