"use client";

import { observer } from 'mobx-react-lite';
import {Button, Modal} from 'react-bootstrap';
import { headerStore } from "@/src/entities/header";
import {HeaderModalContacts} from "@/src/shared/lib/header";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeaderInfoModal.module.css";

/*
* Модальное окно для кнопки "Контакты" в header
* */
const HeaderInfoModal = observer(() => {
    return (
        <>
            <Modal
                contentClassName="rounded-4 bg-white border-0"
                show={headerStore.isOpenModal}
                onHide={() => headerStore.closeModal()}
                centered
                size="xl"
                dialogClassName="modal-1080"
            >
                <Modal.Header className={`justify-center relative border-0 container-padding ${styles.modalHeader}`}>
                    <Modal.Title className={`w-full text-center leading-[100%] tracking-[-0.02em] font-medium ${styles.modalTitle}`}>
                        {HeaderModalContacts.name}
                    </Modal.Title>
                    <Image
                        width={40}
                        height={40}
                        src="/closeIcon.svg"
                        alt="close"
                        className={styles.modalClose}
                        onClick={() => headerStore.closeModal()}
                    />
                </Modal.Header>
                <Modal.Body className="flex flex-col justify-center items-center border-t border-[#67668233] container-padding">
                    <div className={`flex flex-col gap-3 items-center text-[#5078DF] ${styles.contactLinksWrap}`}>
                        <Link href={HeaderModalContacts.phoneNumber.link} className={styles.contactLink}>
                            {HeaderModalContacts.phoneNumber.name}
                        </Link>
                        <Link href={HeaderModalContacts.email.link} className={styles.contactLink}>
                            {HeaderModalContacts.email.name}
                        </Link>
                    </div>
                    <div className={styles.buttonsRow}>
                        <Link href={HeaderModalContacts.whatsapp.link}>
                            <Button className={`d-flex align-items-center justify-content-center gap-2 rounded-5 border-0 ${styles.modalButton}`} style={{ color: '#5078DF', background: '#E5E7F0'}}>
                                <Image
                                    src={HeaderModalContacts.whatsapp.icon}
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                />
                                {HeaderModalContacts.whatsapp.name}
                            </Button>
                        </Link>
                        <Link href={HeaderModalContacts.telegram.link}>
                            <Button className={`d-flex align-items-center justify-content-center gap-2 rounded-5 bg-[#5078DF] text-white border-0 ${styles.modalButton}`}>
                                <Image
                                    src={HeaderModalContacts.telegram.icon}
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                />
                                {HeaderModalContacts.telegram.name}
                            </Button>
                        </Link>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
});

HeaderInfoModal.displayName = 'HeaderInfoModal';

export default HeaderInfoModal;