import React, { useState } from 'react';

const UserDashboard = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        mobile: '',
        balance: '',
        pin: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendMoney = async () => {
         

        if (!formValues.mobile || !formValues.balance || !formValues.pin || isNaN(formValues.balance) || formValues.balance <= 0) {
            alert('Please fill all fields with valid values.');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/sendMoney`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userMail: user.email,
                        mobile: formValues.mobile,
                        balance: Number(formValues.balance),
                        pin: formValues.pin,
                    }),
                }
            );

            if (response.statusText === 'Unauthorized') {
                alert('Invalid PIN. Please try again.');
                return;
            }
            if (response.statusText === 'Not Found') {
                alert('User not found. Please check the mobile number.');
                return;
            }
            console.log(response)
            if (response.ok) {
                alert('Your cash-in request has been processed successfully.');
            } else {
                alert('There was an error processings your request. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('There was an error processing your request. Please try again.');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    Send Money
                </button>
                <button
                    className="w-full py-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition cursor-pointer"
                    onClick={() => console.log('Cash Out button clicked')}
                >
                    Cash Out
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Send Money</h2>
                        <input
                            type="text"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            className="w-full mb-2 p-2 border rounded"
                            value={formValues.mobile}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="balance"
                            placeholder="Enter Balance"
                            className="w-full mb-2 p-2 border rounded"
                            value={formValues.balance}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="pin"
                            placeholder="Enter PIN"
                            className="w-full mb-4 p-2 border rounded"
                            value={formValues.pin}
                            onChange={handleInputChange}
                        />
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleSendMoney}
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