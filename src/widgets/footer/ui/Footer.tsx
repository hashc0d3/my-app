"use client";

import FooterCards from "./FooterCards";
import {footerInfo} from "@/src/shared/lib/footer";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer key="footer" className={styles.footer}>
            <FooterCards />
            <section key="footerInfo" className={styles.infoSection}>
                {/*
                    Наименование бренда
                */}
                <p className={styles.title}>
                    {footerInfo.title}
                </p>
                <div className={styles.infoRow}>
                    {/*
                        Левый блок под наименование бренда
                    */}
                    <ul className={styles.infoList}>
                        {footerInfo.leftSection.map((item) => (
                            <li key={item.text}>
                                <a
                                    href={item.href}
                                    className={styles.infoLink}
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/*
                        Правый блок под наименование бренда
                    */}
                    <ul className={styles.infoList}>
                        {footerInfo.rightSection.map((item) => (
                            <li key={item.text}>
                                <a
                                    href={item.href}
                                    className={styles.infoLink}
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