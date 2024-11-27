import React from "react";
import Image from "next/image";
import Link from "next/link";


export function Header() {
    return (
        <header className="w-full   h-24 shadow-md">
            <div className='container mx-auto flex justify-center items-center h-full'>
                <Link href="/" className='flex items-center gap-4'>
                    <Image
                        src="/logo-no-bg.png"
                        alt="EmotiSense"
                        width={50}
                        height={50}
                    />
                    <h1 className='text-2xl font-bold'>EmotiSense</h1>
                </Link>
            </div>
        </header>
    );
}