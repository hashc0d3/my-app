import { action, makeObservable, observable } from 'mobx';

class CartStore {
    @observable items: number;

    constructor() {
        makeObservable(this);
        this.items = 0;
    }

    @action addItem = () => {
        this.items++;
    }

    @action delItem = () => {
        if (this.items > 0) { // защита от отрицательных значений
            this.items--;
        }
    }
}

export default new CartStore();