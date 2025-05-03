import React from 'react';

const UserDashboard = () => {
    const handleClick = (action) => {
        console.log(`${action} button clicked`);
    };

    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition cursor-pointer"
                    onClick={() => handleClick('Send Money')}
                >
                    Send Money
                </button>
                <button
                    className="w-full py-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition cursor-pointer"
                    onClick={() => handleClick('Cash Out')}
                >
                    Cash Out
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;