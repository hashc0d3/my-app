import { action, makeObservable, observable } from 'mobx';

class HeaderStore {
    @observable isOpenModal: boolean;

    constructor() {
        makeObservable(this);
        this.isOpenModal = false;
    }

    @action toggleModal = () => {
        this.isOpenModal = !this.isOpenModal;
    }
}

export default new HeaderStore();