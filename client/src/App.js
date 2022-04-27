import "./App.css";
import React, { Fragment, useEffect } from "react";
import PrivateRoute from "./components/routing/PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import setAuthToken from "./utils/setAuthToken";
import { loadOffice } from "./actions/auth";
import Login from "./components/auth/Login";
import ScheduleForm from "./components/meetings/ScheduleForm";
import Rooms from "./components/rooms/Rooms";
import RoomCalendar from "./components/rooms/RoomCalendar";
import Dashboard from "./components/dashboard/Dashboard";
import Meeting from "./components/meetings/Meeting";
import AddOffice from "./components/dashboard/admin/AddOffice";
import Alert from "./components/layout/Alert";
import { LOGOUT } from "./actions/types";
import "bootstrap/dist/css/bootstrap.min.css";

//Redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  //useEffect is like componentDidMount life cycle
  useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadOffice());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container mt-5 mb-0 p-0">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/rooms" component={Rooms} />
              <Route exact path="/rooms/:id" component={RoomCalendar} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/meeting/view/:id"
                component={Meeting}
              />
              <PrivateRoute
                exact
                path="/create-meeting"
                component={ScheduleForm}
              />
              <PrivateRoute exact path="/add-office" component={AddOffice} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
