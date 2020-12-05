import React from 'react';
import { Provider } from 'mobx-react';
import App from './src/App';
import store from './src/store/index';
export default function setup() {

    class Root extends React.Component {

        render() {

            return (
                <Provider {...store}>
                    <App />
                </Provider>
            );

        }

    }
    return Root;

}
