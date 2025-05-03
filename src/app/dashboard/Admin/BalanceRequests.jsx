import React from "react";
import Swal from "sweetalert2";

const BalanceRequests = ({user, showApproved,setShowApproved, approvedRequests,setApprovedRequests, pendingRequests, setPendingRequests}) => {
  return (
    <div>
      <div>
        <div className="mt-4">
          <button
            className={`py-2 px-4 ${
              showApproved ? "bg-blue-500" : "bg-gray-300"
            } text-white rounded hover:bg-blue-600 transition`}
            onClick={() => setShowApproved(true)}
          >
            Show Approved Requests
          </button>
          <button
            className={`py-2 px-4 ml-4 ${
              !showApproved ? "bg-blue-500" : "bg-gray-300"
            } text-white rounded hover:bg-blue-600 transition`}
            onClick={() => setShowApproved(false)}
          >
            Show Pending Requests
          </button>
        </div>

        {showApproved ? (
          <table className="table-auto mt-4 w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Request ID</th>
                <th className="border border-gray-300 px-4 py-2">Agent Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Requested Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Current Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {approvedRequests.map((request, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {request._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.requestedBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.currentBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="table-auto mt-4 w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Request ID</th>
                <th className="border border-gray-300 px-4 py-2">Agent Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Requested Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Current Balance
                </th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {request._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.requestedBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.currentBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      onClick={async () => {
                        const { value: pin } = await Swal.fire({
                          title: "Enter PIN",
                          input: "password",
                          inputLabel: "Enter your PIN to approve",
                          inputPlaceholder: "Enter PIN (min 5 characters)",
                          inputAttributes: {
                            minlength: 5,
                            maxlength: 10,
                            autocapitalize: "off",
                            autocorrect: "off",
                          },
                          showCancelButton: true,
                        });

                        if (pin && pin.length >= 5) {
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyPin`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  identifier: user.email,
                                  pin: pin,
                                }),
                              }
                            );

                            if (response.ok) {
                              const updateResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/updateBalance`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    userId: request.userId,
                                    balance: request.requestedBalance,
                                  }),
                                }
                              );

                              if (updateResponse.ok) {
                                const approveResponse = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/approveTransaction`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      transactionId: request._id,
                                    }),
                                  }
                                );

                                if (approveResponse.ok) {
                                  Swal.fire(
                                    "Success",
                                    "Request approved and balance updated successfully!",
                                    "success"
                                  );
                                  setPendingRequests((prev) =>
                                    prev.filter((r) => r._id !== request._id)
                                  );
                                  setApprovedRequests((prev) => [
                                    ...prev,
                                    request,
                                  ]);
                                } else {
                                  Swal.fire(
                                    "Error",
                                    "Failed to approve transaction.",
                                    "error"
                                  );
                                }
                              } else {
                                Swal.fire(
                                  "Error",
                                  "Failed to update balance.",
                                  "error"
                                );
                              }
                            } else {
                              Swal.fire(
                                "Error",
                                "Invalid PIN or approval failed.",
                                "error"
                              );
                            }
                          } catch (error) {
                            Swal.fire(
                              "Error",
                              "Something went wrong.",
                              "error"
                            );
                          }
                        } else {
                          Swal.fire(
                            "Error",
                            "PIN must be at least 5 characters long.",
                            "error"
                          );
                        }
                      }}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BalanceRequests;
