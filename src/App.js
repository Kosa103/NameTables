import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import React from 'react';
import NamesPage from './NamesPage.js';
import TodosApp from './TodosPage.js';
import './App.css';


function App() {
  return (
    <Router>
      <Link to="/" id="home-link">HOME</Link>
      <Switch>
        <Route path="/" exact strict component={NamesPage} />
        <Route path="/user/:id/todos" exact strict component={TodosApp} />
      </Switch>
    </Router>
  );
}


export default App;
