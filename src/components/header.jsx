import React from 'react';
import parrot from '../assets/img/parrot.png';

export default function Header() {
    return (
        <>

            <div className="flex justify-center h-[200px] bg-[url('../src/assets/img/header-background.png')] bg-top bg-no-repeat">

                <div className="flex items-center gap-4 p-10">

                    <div className="logo-section">
                        <img 
                            src={parrot}
                            alt="PollyGlot Logo"  
                            width={95} 
                            height={85}/>
                    </div>

                    <div className="text-section">
                        <h2 className="text-2xl font-bold text-green-600">PollyGlot</h2>
                        <p className="text-md text-white font-bold">Perfect Translation Every Time</p>
                    </div>

                </div>


            </div>


        </>
    );
}

