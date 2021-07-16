
import {BrowserRouter as Router, Switch , Route, Redirect} from 'react-router-dom';
import Confirm from './components/Confirm/confirm';
import Login from './components/Login/Login';
import Forgot from './components/Forgot/Forgot';
import Reset from './components/Reset/Reset';

import Main from './components/Main';
import Register from './components/Register/Register';
import { AuthProvider, Auth } from './context';

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
          <Switch>
            <FadingRoute exact path="/register" component={Register} access={false} />
            <FadingRoute exact path="/activate/:id/:token" component={Confirm} access={false} />
            <FadingRoute exact path="/confirm_password/:email/:token" component={Forgot} access={false} />
            <FadingRoute exact path="/reset" component={Reset} access={false}/> 
            <FadingRoute exact path="/login" component={Login} access={false}/>
            <FadingRoute exact path="/"  component={Main} access={true}/>
          </Switch>
      </AuthProvider>
    </Router>
      
    </>
  );
}

function FadingRoute({ component: Component, access,  ...rest }) {
  const {user} = Auth();
  if( user && !access ) return <Redirect to="/" />
  if( !user && access) return  <Redirect to="/login" />
  return (
    <Route
      {...rest}
      render={ routeProps => ( <Component {...routeProps} />) }
    />
  );
}

export default App;
