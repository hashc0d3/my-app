import { action, makeObservable, observable } from 'mobx';

/**
 * Стор виджета Header (FSD: entities/header).
 * Хранит только состояние модалки «Информация»; корзина — в entities/cart.
 */
class HeaderStore {
    @observable isOpenModal: boolean;

    constructor() {
        makeObservable(this);
        this.isOpenModal = false;
    }

    @action toggleModal = () => {
        this.isOpenModal = !this.isOpenModal;
    };
}

export default new HeaderStore();