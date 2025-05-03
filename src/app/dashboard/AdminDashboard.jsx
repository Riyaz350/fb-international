import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
 

const AdminDashboard = ({ user }) => {
    const [showModal, setShowModal] = useState(false);
    const [pendingAgents, setPendingAgents] = useState([]);

    useEffect(() => {
        const fetchPendingAgents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/allUsers`);
                const data = await response.json();
                const filteredAgents = data.filter(
                    (user) => user.accountType === 'Agent' && user.verified === false
                );
                setPendingAgents(filteredAgents);
            } catch (error) {
                console.error('Error fetching pending agents:', error);
            }
        };

        fetchPendingAgents();
    }, []);


    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    Pending Agents
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Pending Agents</h2>
                        <ul>
                            {pendingAgents.map((agent) => (
                                <li key={agent._id} className="flex justify-between items-center mb-4 border-1 border-black p-2">
                                    <span>{agent.name}</span>
                                    {agent.showInput ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span>Pin:</span>
                                                <input
                                                    type="password"
                                                    placeholder="Enter Pin"
                                                    className="py-1 px-2 w-20 border rounded"
                                                    onChange={(e) =>
                                                        setPendingAgents((prev) =>
                                                            prev.map((a) =>
                                                                a._id === agent._id ? { ...a, pin: e.target.value } : a
                                                            )
                                                        )
                                                    }
                                                />
                                                <button
                                                    className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                                    onClick={async () => {
                                                        if (!agent.pin || agent.pin.length !== 5) {
                                                            setPendingAgents((prev) =>
                                                                prev.map((a) =>
                                                                    a._id === agent._id
                                                                        ? { ...a, error: 'Please enter a 5-digit pin' }
                                                                        : a
                                                                )
                                                            );
                                                            return;
                                                        }
                                                        try {
                                                            const response = await fetch(
                                                                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyPin`,
                                                                {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body: JSON.stringify({
                                                                        identifier: user.email,
                                                                        pin: agent.pin,
                                                                    }),
                                                                }
                                                            );
                                                            const result = await response.json();
                                                            if (result.isMatch) {
                                                                const verifyResponse = await fetch(
                                                                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyAgent`,
                                                                    {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                        body: JSON.stringify({
                                                                            userId: agent._id,
                                                                        }),
                                                                    }
                                                                );
                                                                console.log(verifyResponse)
                                                                if (verifyResponse.ok) {
                                                                    setPendingAgents((prev) =>
                                                                        prev.filter((a) => a._id !== agent._id)
                                                                    );
                                                                    Swal.fire({
                                                                        icon: 'success',
                                                                        title: 'Success',
                                                                        text: 'Agent verified successfully!',
                                                                    });
                                                                } else {
                                                                    Swal.fire({
                                                                        icon: 'error',
                                                                        title: 'Error',
                                                                        text: 'Failed to verify agent.',
                                                                    });
                                                                }
                                                            } else {
                                                                setPendingAgents((prev) =>
                                                                    prev.map((a) =>
                                                                        a._id === agent._id
                                                                            ? { ...a, error: 'Invalid pin' }
                                                                            : a
                                                                    )
                                                                );
                                                            }
                                                        } catch (error) {
                                                            console.error('Error verifying agent:', error);
                                                        }
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                            {agent.error && (
                                                <span className="text-red-500 text-sm">{agent.error}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            className="py-1 px-3 w-fit bg-green-500 text-white rounded hover:bg-green-600 transition"
                                            onClick={() => {
                                                setPendingAgents((prev) =>
                                                    prev.map((a) =>
                                                        a._id === agent._id ? { ...a, showInput: true } : a
                                                    )
                                                );
                                            }}
                                        >
                                            Verify Now
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;