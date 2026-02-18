"use client";

import FooterCards from "@/app/features/footer/footerCards";
import {footerInfo} from "@/app/lib/footer";

const Footer = () => {
    return (
        <footer key="footer" className="flex flex-col gap-5 bg-[#ffffff] text-black container-padding pb-8">
            <FooterCards />
            <section key="footerInfo" className="flex flex-col gap-1">
                {/*
                    Наименование бренда
                */}
                <p
                    className="text-[212px] leading-[90%] tracking-[-0.05em] font-normal text-center text-[#2F2C33] w-full"
                >
                    {footerInfo.title}
                </p>
                <div className="flex justify-between">
                    {/*
                        Левый блок под наименование бренда
                    */}
                    <ul className="flex gap-5 p-0">
                        {footerInfo.leftSection.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="text-[14px] leading-[130%] tracking-[-0.02em] font-normal text-[#67668299]"
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/*
                        Правый блок под наименование бренда
                    */}
                    <ul className="flex gap-5">
                        {footerInfo.rightSection.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="text-[14px] leading-[130%] tracking-[-0.02em] font-normal text-[#67668299]"
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </footer>
    );
};

export default Footer;