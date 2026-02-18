"use client";

import { observer } from 'mobx-react-lite';
import {Button, Modal} from 'react-bootstrap';
import headerStore from "@/app/store/HeaderStore";
import {HeaderModalContacts} from "@/app/lib/header";
import Link from "next/link";
import Image from "next/image";


/*
* Модальное окно для кнопки "Контакты" в header
* */
const HeaderInfoModal = observer(() => {
    return (
        <>
            <Modal
                contentClassName="rounded-4 bg-white border-0"
                show={headerStore.isOpenModal}
                onHide={() => headerStore.toggleModal()}
                centered
                size="xl"
                dialogClassName="modal-1080"
            >
                <Modal.Header className="justify-center relative border-0">
                    <Modal.Title
                        className="w-full text-center pb-7 pt-7 leading-[100%] tracking-[-0.02em] font-medium"
                        style={{ fontSize: '32px', color: '#2F2C33' }}
                    >
                        {HeaderModalContacts.name}
                    </Modal.Title>
                    <Image
                        width={40}
                        height={40}
                        src="/closeIcon.svg"
                        alt="close"
                        className="absolute right-6 top-6 cursor-pointer"
                        onClick={() => headerStore.toggleModal()}
                    />
                </Modal.Header>
                <Modal.Body className="flex flex-col gap-7 justify-center items-center border-t border-[#67668233] ml-12 mr-12">
                    <div className="flex flex-col gap-3 items-center text-[#5078DF] pt-7">
                        <Link
                            href={HeaderModalContacts.phoneNumber.link}
                            className="text-[22px] leading-[100%] tracking-[-0.02em] font-medium text-center"
                        >
                            {HeaderModalContacts.phoneNumber.name}
                        </Link>
                        <Link
                            href={HeaderModalContacts.email.link}
                            className="text-[22px] leading-[100%] tracking-[-0.02em] font-medium text-center"
                        >
                            {HeaderModalContacts.email.name}
                        </Link>
                    </div>
                    <div className="flex justify-center gap-2 pb-12">
                        <Link href={HeaderModalContacts.whatsapp.link}>
                            <Button className="d-flex align-items-center gap-2 rounded-5 border-0" style={{ color: '#5078DF', background: '#E5E7F0'}}>
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
                            <Button className="d-flex align-items-center gap-2 rounded-5 bg-[#5078DF] text-white border-0">
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