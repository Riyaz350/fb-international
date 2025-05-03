import React from "react";
import Swal from "sweetalert2";

const AgentsDashboard = ({ user }) => {
    const handleClick = () => {
        if (!user.verified) {
            Swal.fire({
                icon: "warning",
                title: "Not Verified",
                text: "You are not verified. Please wait for the admin to verify you.",
            });
            return;
        }
    };

    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition cursor-pointer"
                    onClick={handleClick}
                >
                    Balance Request
                </button>
                <button
                    className="w-full py-4 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition cursor-pointer"
                    onClick={handleClick}
                >
                    Cash In
                </button>
            </div>
        </div>
    );
};

export default AgentsDashboard;
