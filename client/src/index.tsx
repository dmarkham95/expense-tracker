import { StoreProvider } from 'easy-peasy';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './app/store';
import './styles/index.css';
import App from 'app/App';

const rootEl = document.getElementById("root");

const render = () => {
	ReactDOM.render(<App />, rootEl);
};

window.onload = () => {
	render();
};

// ReactDOM.render(
//   <Router>
//     <StoreProvider store={store}>
//       <App />
//     </StoreProvider>
//   </Router>,
//   document.getElementById('root')
// );
