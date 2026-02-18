"use client";

import Dropdown from 'react-bootstrap/Dropdown';
import {progressBarFilters} from "@/app/lib/progressBar";
import Image from "next/image";
import {useState} from "react";
import watchModelStore from "@/app/store/WatchModelStore";

interface ProgressBarFiltersProps {
    isSticky: boolean;
}

export function ProgressBarFilters({ isSticky }: ProgressBarFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedColor = watchModelStore.selectedColor?.name;
    const selectedSize = watchModelStore.selectedSize;

    console.log(selectedColor,selectedSize,'TEST');

    return (
        <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)}>
            <Dropdown.Toggle
                style={{
                    borderRadius: isOpen ? '20px 20px 0 0' : '100px',
                    display: 'flex',
                    alignItems: 'center',
                    background: "#D4E0FF99",
                    border: 'none',
                    color: '#000',
                    gap: '8px',
                    height: '46px',
                    padding: '8px 12px'
                }}
                className={`transition-colors ${isSticky ? 'bg-[#D4E0FF99] backdrop-blur-md border-[#D4E0FF99]' : 'bg-[#D4E0FF] border-[#D4E0FF]'}`}
            >
                {progressBarFilters.name}
                <Image
                    src={isOpen ? progressBarFilters.iconOpen : progressBarFilters.iconClose}
                    alt="toggle"
                    width={20}
                    height={22}
                />
            </Dropdown.Toggle>

            <Dropdown.Menu
                style={{
                    marginTop: '-2px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    width: '100%',
                    minWidth: '100%',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                    background: "#D4E0FF99",
                    border: 'none',
                    borderTop: 'none'
                }}
                className={`transition-colors ${isSticky ? 'bg-[#D4E0FF99] backdrop-blur-md border-[#D4E0FF99]' : 'bg-[#D4E0FF] border-[#D4E0FF]'}`}
            >
                <div style={{
                    height: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    marginLeft: '20px',
                    marginRight: '20px',
                    marginBottom: '4px'
                }} />
                <Dropdown.Item href="#/action-1">{selectedColor}</Dropdown.Item>
                <Dropdown.Item href="#/action-2">{selectedSize}mm</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ProgressBarFilters;