import React from "react";
import Swal from 'sweetalert2';

const Agents = ({ user, agents }) => {
    const handleAddBalance = (agent) => {
        Swal.fire({
            title: "Add Balance",
            input: "number",
            inputLabel: "Enter the amount to add:",
            showCancelButton: true,
            confirmButtonText: "Next",
            preConfirm: (amount) => {
                if (!amount || isNaN(amount) || amount <= 0) {
                    Swal.showValidationMessage("Please enter a valid amount");
                    return false;
                }
                return amount;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const amount = result.value;
                Swal.fire({
                    title: "Enter PIN",
                    input: "password",
                    inputLabel: "Enter your PIN:",
                    showCancelButton: true,
                    confirmButtonText: "Verify",
                    preConfirm: (pin) => {
                        if (!pin) {
                            Swal.showValidationMessage("Please enter your PIN");
                            return false;
                        }
                        return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyPin`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                identifier: user.email,
                                pin: pin,
                            }),
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                if (!data.isMatch) {
                                    Swal.showValidationMessage("Invalid PIN");
                                    return false;
                                }
                                return true;
                            })
                            .catch(() => {
                                Swal.showValidationMessage("Error verifying PIN");
                                return false;
                            });
                    },
                }).then((pinResult) => {
                    
                    if (pinResult.isConfirmed) {
                        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyAgent`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: agent._id,
                                balance: amount,
                            }),
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log("data",data);
                                if (data.user) {
                                    Swal.fire("Success", "Balance added successfully", "success");
                                } else {
                                    Swal.fire("Error", "Failed to add balance", "error");
                                }
                            })
                            .catch(() => {
                                Swal.fire("Error", "Failed to add balance", "error");
                            });
                    }
                });
            }
        });
    };

    return (
        <div>
            <div className="mt-4">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Verified</th>
                            <th className="border border-gray-300 px-4 py-2">Balance</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent) => (
                            <tr key={agent._id}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {agent.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {agent.email}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {agent.verified ? "Yes" : "No"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {agent.balance || 0}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                        onClick={() => handleAddBalance(agent)}
                                    >
                                        Add Balance
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Agents;
