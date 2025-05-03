import React, { useState } from "react";
import Swal from "sweetalert2";

const AgentsDashboard = ({ user }) => {
    const [isCashInModalOpen, setCashInModalOpen] = useState(false);
    const [isBalanceRequestModalOpen, setBalanceRequestModalOpen] = useState(false);
    const [cashInForm, setCashInForm] = useState({ mobile: "", balance: "", pin: "" });
    const [balanceRequestAmount, setBalanceRequestAmount] = useState("");
    const [cashInErrors, setCashInErrors] = useState({});
    const [balanceRequestError, setBalanceRequestError] = useState("");

    const handleCashInSubmit = async () => {
        const errors = {};
        if (!cashInForm.mobile) errors.mobile = "Mobile number is required.";
        if (!cashInForm.balance || isNaN(cashInForm.balance) || cashInForm.balance <= 0) {
            errors.balance = "Enter a valid balance.";
        }
        if (!cashInForm.pin) errors.pin = "PIN is required.";

        if (Object.keys(errors).length > 0) {
            setCashInErrors(errors);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/cashIn`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        agentMail: user.email,
                        mobile: cashInForm.mobile,
                        balance: Number(cashInForm.balance),
                        pin: cashInForm.pin,
                    }),
                }
            );

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Cash In Successful",
                    text: "Your cash-in request has been processed successfully.",
                    timer: 1000,
                    timerProgressBar: true,
                });
                window.location.reload();
                setCashInForm({ mobile: "", balance: "", pin: "" });
                setCashInErrors({});
            } else {
                const errorData = await response.json();
                const newErrors = {};
                if (errorData?.error) {
                    if (errorData.error === "User not found") {
                        newErrors.mobile = "User not found. Please check the mobile number.";
                    }
                     else if (errorData.error === "Invalid PIN") {
                        newErrors.pin = "Invalid PIN. Please try again.";
                    } else {
                        newErrors.general = errorData.error;
                    }
                } else {
                    newErrors.general = "An unexpected error occurred. Please try again.";
                }
                setCashInErrors(newErrors);
            }
        } catch (error) {
            console.error(error);
            setCashInErrors({ general: "There was an error processing your request. Please try again." });
        }
    };

    console.log(cashInErrors, "cashInErrors");

    const handleBalanceRequestSubmit = async () => {
        if (!balanceRequestAmount || isNaN(balanceRequestAmount) || balanceRequestAmount <= 0) {
            setBalanceRequestError("Please enter a valid amount.");
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/balanceRequest`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        requestedBalance: balanceRequestAmount,
                    }),
                }
            );

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Request Submitted",
                    text: "Your balance request has been submitted successfully.",
                    timer: 1000,
                    timerProgressBar: true,
                });
                setBalanceRequestAmount("");
                setBalanceRequestError("");
            } else {
                setBalanceRequestError("There was an error submitting your request. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setBalanceRequestError("There was an error submitting your request. Please try again.");
        } finally {
            setBalanceRequestModalOpen(false);
        }
    };

    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition cursor-pointer"
                    onClick={() => setBalanceRequestModalOpen(true)}
                >
                    Balance Request
                </button>
                <button
                    className="w-full py-4 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition cursor-pointer"
                    onClick={() => setCashInModalOpen(true)}
                >
                    Cash In
                </button>
            </div>

            {/* Cash In Modal */}
            {isCashInModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Cash In</h2>
                        <input
                            type="text"
                            placeholder="Enter Mobile Number"
                            className="w-full mb-2 p-2 border rounded"
                            value={cashInForm.mobile}
                            onChange={(e) => setCashInForm({ ...cashInForm, mobile: e.target.value })}
                        />
                        {cashInErrors.mobile && <p className="text-red-500 text-sm">{cashInErrors.mobile}</p>}
                        <input
                            type="number"
                            placeholder="Enter Balance"
                            className="w-full mb-2 p-2 border rounded"
                            value={cashInForm.balance}
                            onChange={(e) => setCashInForm({ ...cashInForm, balance: e.target.value })}
                        />
                        {cashInErrors.balance && <p className="text-red-500 text-sm">{cashInErrors.balance}</p>}
                        <input
                            type="password"
                            placeholder="Enter PIN"
                            className="w-full mb-4 p-2 border rounded"
                            value={cashInForm.pin}
                            onChange={(e) => setCashInForm({ ...cashInForm, pin: e.target.value })}
                        />
                        {cashInErrors.pin && <p className="text-red-500 text-sm">{cashInErrors.pin}</p>}
                        {cashInErrors.general && <p className="text-red-500 text-sm">{cashInErrors.general}</p>}
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={() => setCashInModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded"
                                onClick={handleCashInSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Balance Request Modal */}
            {isBalanceRequestModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Balance Request</h2>
                        <input
                            type="number"
                            placeholder="Enter the amount you want to request"
                            className="w-full mb-4 p-2 border rounded"
                            value={balanceRequestAmount}
                            onChange={(e) => setBalanceRequestAmount(e.target.value)}
                        />
                        {balanceRequestError && <p className="text-red-500 text-sm">{balanceRequestError}</p>}
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={() => setBalanceRequestModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded"
                                onClick={handleBalanceRequestSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentsDashboard;
