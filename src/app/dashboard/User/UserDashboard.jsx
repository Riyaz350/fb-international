import React, { useState } from "react";
import Swal from "sweetalert2";

const UserDashboard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    mobile: "",
    balance: "",
    pin: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMoney = async () => {
    if (
      !formValues.mobile ||
      !formValues.balance ||
      !formValues.pin ||
      isNaN(formValues.balance) ||
      formValues.balance <= 0
    ) {
      alert("Please fill all fields with valid values.");
      return;
    }

    if (formValues.balance < 50) {
      Swal.fire({
        icon: "error",
        text: "Send money must be at least 50 to proceed.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/sendMoney`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMail: user.email,
            mobile: formValues.mobile,
            balance: Number(formValues.balance),
            pin: formValues.pin,
          }),
        }
      );

      if (response.statusText === "Unauthorized") {
        Swal.fire({
          icon: "error",
          title: "Invalid PIN",
          text: "Please try again.",
        });
        return;
      }
      if (response.statusText === "Not Found") {
        Swal.fire({
          icon: "error",
          title: "User Not Found",
          text: "Please check the mobile number.",
        });
        return;
      }
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your send money request has been processed successfully.",
          timer: 1000,
          timerProgressBar: true,
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error processing your request. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error processing your request. Please try again.",
      });
    } finally {
      setIsModalOpen(false);
    }
  };
  const handleCashOut = async () => {
    if (
        !formValues.mobile ||
        !formValues.balance ||
        !formValues.pin ||
        isNaN(formValues.balance) ||
        formValues.balance <= 0
    ) {
        alert("Please fill all fields with valid values.");
        return;
    }

    if (formValues.balance < 50) {
        Swal.fire({
            icon: "error",
            text: "Cash out amount must be at least 50 to proceed.",
        });
        return;
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/cashOut`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: formValues.mobile,
                    amount: Number(formValues.balance),
                    pin: formValues.pin,
                }),
            }
        );

        if (response.status === 401) {
            Swal.fire({
                icon: "error",
                title: "Invalid PIN",
                text: "Please try again.",
            });
            return;
        }
        if (response.status === 404) {
            Swal.fire({
                icon: "error",
                title: "Agent Not Found",
                text: "Please check the agent number.",
            });
            return;
        }
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Your cash out request has been processed successfully.",
                timer: 1000,
                timerProgressBar: true,
            });
            window.location.reload();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "There was an error processing your request. Please try again.",
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error processing your request. Please try again.",
        });
    } finally {
        setIsModalOpen(false);
    }
};

return (
    <div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                className="w-full py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition cursor-pointer"
                onClick={() => setIsModalOpen({ type: "sendMoney" })}
            >
                Send Money
            </button>

            <button
                className="w-full py-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition cursor-pointer"
                onClick={() => setIsModalOpen({ type: "cashOut" })}
            >
                Cash Out
            </button>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">
                        {isModalOpen.type === "sendMoney" ? "Send Money" : "Cash Out"}
                    </h2>
                    <input
                        type="text"
                        name="mobile"
                        placeholder={
                            isModalOpen.type === "sendMoney"
                                ? "Enter Mobile Number"
                                : "Enter Agent Number"
                        }
                        className="w-full mb-2 p-2 border rounded"
                        value={formValues.mobile}
                        onChange={handleInputChange}
                    />
                    {!formValues.mobile && (
                        <p className="text-red-500 text-sm">Mobile number is required.</p>
                    )}
                    <input
                        type="number"
                        name="balance"
                        placeholder="Enter Amount"
                        className="w-full mb-2 p-2 border rounded"
                        value={formValues.balance}
                        onChange={handleInputChange}
                    />
                    {formValues.balance && formValues.balance < 50 && (
                        <p className="text-red-500 text-sm">
                            Amount must be at least 50.
                        </p>
                    )}
                    {!formValues.balance && (
                        <p className="text-red-500 text-sm">Amount is required.</p>
                    )}
                    <input
                        type="password"
                        name="pin"
                        placeholder="Enter PIN"
                        className="w-full mb-4 p-2 border rounded"
                        value={formValues.pin}
                        onChange={handleInputChange}
                    />
                    {!formValues.pin && (
                        <p className="text-red-500 text-sm">PIN is required.</p>
                    )}
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded mr-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={
                                isModalOpen.type === "sendMoney"
                                    ? handleSendMoney
                                    : handleCashOut
                            }
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

export default UserDashboard;
