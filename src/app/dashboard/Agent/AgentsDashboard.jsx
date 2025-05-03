import React from "react";
import Swal from "sweetalert2";

const AgentsDashboard = ({ user }) => {
    const handleClick = async () => {
        if (!user.verified) {
            Swal.fire({
                icon: "warning",
                title: "Not Verified",
                text: "You are not verified. Please wait for the admin to verify you.",
            });
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: "Cash In",
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Enter Mobile Number">' +
                '<input id="swal-input2" type="number" class="swal2-input" placeholder="Enter Balance">' +
                '<input id="swal-input3" type="password" class="swal2-input" placeholder="Enter PIN">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const mobile = document.getElementById("swal-input1").value;
                const balance = document.getElementById("swal-input2").value;
                const pin = document.getElementById("swal-input3").value;

                if (!mobile || !balance || !pin || isNaN(balance) || balance <= 0) {
                    Swal.showValidationMessage("Please fill all fields with valid values");
                    return null;
                }

                return { mobile, balance: Number(balance), pin };
            },
        });

        if (formValues) {
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
                            mobile: formValues.mobile,
                            balance: formValues.balance,
                            pin: formValues.pin,
                        }),
                    }
                );
                if(response.statusText == "Unauthorized"){
                    Swal.fire({
                        icon: "error",
                        title: "Cash In Failed",
                        text: "Invalid PIN. Please try again.",
                    });
                    return;
                }
                if(response.statusText == "Not Found"){
                    Swal.fire({
                        icon: "error",
                        title: "Cash In Failed",
                        text: "User not found. Please check the mobile number.",
                    });
                    return;
                }
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Cash In Successful",
                        text: "Your cash-in request has been processed successfully.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Cash In Failed",
                        text: "There was an error processing your request. Please try again.",
                    });
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Cash In Failed",
                    text: "There was an error processing your request. Please try again.",
                });
            }
        }
    };

    const handleBalanceRequest = async () => {
        if (!user.verified) {
            Swal.fire({
                icon: "warning",
                title: "Not Verified",
                text: "You are not verified. Please wait for the admin to verify you.",
            });
            return;
        }

        const { value: balance } = await Swal.fire({
            title: "Balance Request",
            input: "number",
            inputLabel: "Enter the amount you want to request",
            inputPlaceholder: "Enter amount",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || isNaN(value) || value <= 0) {
                    return "Please enter a valid amount";
                }
            },
        });

        if (balance) {
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
                            requestedBalance: balance,
                        }),
                    }
                );
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Request Submitted",
                        text: "Your balance request has been submitted successfully.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: "There was an error submitting your request. Please try again.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: "There was an error submitting your request. Please try again.",
                });
            }
        }
    };

    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition cursor-pointer"
                    onClick={handleBalanceRequest}
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
