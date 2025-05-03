"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import AgentsDashboard from "./AgentsDashboard";
import AdminDashboard from "./AdminDashboard";
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyToken`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: userToken }),
          }
        );

        const data = await response.json();
        if (data.error) {
          router.push("/login");
        } else {
          setUser(data);
          setLoading(false);
        }
      } catch (error) {
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div>
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4 bg-blue-600 text-white">
        <div className="flex items-center mb-4 sm:mb-0">
          <FaUserCircle size={40} className="mr-3" />
          <div>
            <p className="font-bold text-center sm:text-left">{user.name}</p>
            {user?.accountType === "Agent" && (
              <p className="text-sm text-center sm:text-left">
                {user.verified ? "Verified" : "Not Verified"}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-sm">Account Type: {user.accountType}</p>
            <div className="flex flex-col   items-center sm:items-start    ">
              <p className="text-sm">Balance: ${user.balance}</p>
              {user?.accountType === "Agent" || user?.accountType === "Admin" && (
                <div className="flex items-center justify-center">
                  <p>Income:</p>
                  <p
                    className="text-sm cursor-pointer"
                    onClick={(e) => {
                      e.target.style.filter =
                        e.target.style.filter === "blur(5px)"
                          ? "none"
                          : "blur(5px)";
                    }}
                    style={{ filter: "blur(5px)" }}
                  >
                    ${user.income}
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {user.accountType === "Agent" && <AgentsDashboard user={user} />}
        {user.accountType === "Admin" && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}
