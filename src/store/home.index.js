import { observable, action } from 'mobx';
class HomeIndexStore {

    @observable text;
    @observable num;

    constructor() {

        this.num = 0;
        this.text = 'Hello, this is homePage!!!';

    }

    @action
    plus = () => {

        this.num += 1;

    };

    @action
    minus = () => {

        this.num -= 1;

    };

}

const homeIndexStore = new HomeIndexStore();

export { homeIndexStore };
