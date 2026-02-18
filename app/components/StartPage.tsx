import React from 'react';
import {startPage} from "@/app/lib/startPage";

const StartPage = () => {
    return (
        <section className="flex-column justify-center bg-white container-padding pt-18 pb-11 gap-10">
            <p
                className="text-[#2F2C33] text-[48px] leading-[100%] tracking-[-0.03em] font-medium text-center pl-96 pr-96"
            >
                {startPage.title}
                <span className="text-[#676682]">{startPage.highlight}</span>
            </p>
            <div className='flex justify-content-between'>
                <div className="flex w-full h-screen">
                    {startPage.sections.map((section, index) => (
                        <div
                            key={index}
                            className="w-1/2 h-2/3 bg-cover bg-center bg-no-repeat flex justify-center items-center"
                            style={{
                                backgroundImage: `url(${section.backgroundImage})`
                            }}
                        >
                            <p className="text-white text-center">
                                {section.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>

    );
};

export default StartPage;