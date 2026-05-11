import { action, makeObservable, observable } from 'mobx';

/**
 * Стор виджета Header (FSD: entities/header).
 * Хранит только состояние модалки «Информация»; корзина — в entities/cart.
 */
class HeaderStore {
    isOpenModal: boolean;

    constructor() {
        this.isOpenModal = false;
        makeObservable(this, {
            isOpenModal: observable,
            toggleModal: action,
            openModal: action,
            closeModal: action
        });
    }

    toggleModal = () => {
        this.isOpenModal = !this.isOpenModal;
    };

    openModal = () => {
        this.isOpenModal = true;
    };

    closeModal = () => {
        this.isOpenModal = false;
    };
}

export default new HeaderStore();