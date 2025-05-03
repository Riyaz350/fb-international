import React from "react";
import Swal from "sweetalert2";

const PendingAgents = ({user,pendingAgents, setPendingAgents}) => {
  return (
    <div>
      <div>
        <h2 className="text-lg font-bold mt-6">Pending Agents</h2>
        <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingAgents.map((agent) => (
              <tr key={agent._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {agent.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
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
                                a._id === agent._id
                                  ? { ...a, pin: e.target.value }
                                  : a
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
                                    ? {
                                        ...a,
                                        error: "Please enter a 5-digit pin",
                                      }
                                    : a
                                )
                              );
                              return;
                            }
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
                                    pin: agent.pin,
                                  }),
                                }
                              );
                              const result = await response.json();
                              if (result.isMatch) {
                                const verifyResponse = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyAgent`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      userId: agent._id,
                                      balance:100000
                                    }),
                                  }
                                );
                                if (verifyResponse.ok) {
                                  setPendingAgents((prev) =>
                                    prev.filter((a) => a._id !== agent._id)
                                  );
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Agent verified successfully!",
                                  });
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: "Failed to verify agent.",
                                  });
                                }
                              } else {
                                setPendingAgents((prev) =>
                                  prev.map((a) =>
                                    a._id === agent._id
                                      ? { ...a, error: "Invalid pin" }
                                      : a
                                  )
                                );
                              }
                            } catch (error) {
                              console.error("Error verifying agent:", error);
                            }
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                      {agent.error && (
                        <span className="text-red-500 text-sm">
                          {agent.error}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingAgents;
