import React, { useState, useEffect } from 'react';
import PendingAgents from './PendingAgents';
import Agents from './Agents';
import BalanceRequests from './BalanceRequests';

const AdminDashboard = ({ user }) => {
    const [pendingAgents, setPendingAgents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [showPendingAgents, setShowPendingAgents] = useState(false);
    const [showAllAgents, setShowAllAgents] = useState(false);
    const [showBalanceRequests, setShowBalanceRequests] = useState(false);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showApproved, setShowApproved] = useState(true);
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/allUsers`);
                const data = await response.json();
                const filteredAgents = data.filter(
                    (user) => user.accountType === 'Agent'
                );
                const filteredPendingAgents = data.filter(
                    (user) => user.accountType === 'Agent' && user.verified === false
                );
                setAgents(filteredAgents);
                setPendingAgents(filteredPendingAgents);

                
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        const fetchTransactions = async () => {
            try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction/transactions`);
            const data = await response.json();
            const filteredApprovedRequests = data.filter(
                (transaction) => transaction.type === 'Request' && transaction.approved 
            );
            const filteredPendingRequests = data.filter(
                (transaction) => transaction.type === 'Request' && !transaction.approved 
            );
            setApprovedRequests(filteredApprovedRequests);
            setPendingRequests(filteredPendingRequests);
            } catch (error) {
            console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();

        fetchAgents();
    }, []);

    return (
        <div>
            <button
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => {
                    setShowPendingAgents((prev) => !prev);
                    setShowAllAgents(false);
                    setShowBalanceRequests(false);
                }}
            >
                {showPendingAgents ? 'Hide Pending Agents' : 'Show Pending Agents'}
            </button>

            <button
                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition ml-4"
                onClick={() => {
                    setShowAllAgents((prev) => !prev);
                    setShowPendingAgents(false);
                    setShowBalanceRequests(false);
                }}
            >
                {showAllAgents ? 'Hide All Agents' : 'Show All Agents'}
            </button>

            <button
                className="py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition ml-4"
                onClick={() => {
                    setShowBalanceRequests((prev) => !prev);
                    setShowPendingAgents(false);
                    setShowAllAgents(false);
                }}
            >
                {showBalanceRequests ? 'Hide Balance Requests' : 'Show Balance Requests'}
            </button>

            {showPendingAgents && (
                <PendingAgents user={user} pendingAgents={pendingAgents} setPendingAgents={setPendingAgents} />
            )}

            {showAllAgents && (
                <Agents user={user} agents={agents} setAgents={setAgents} />
            )}

            {showBalanceRequests && (
                <BalanceRequests user={user} showApproved={showApproved} setShowApproved={setShowApproved} pendingRequests={pendingRequests} setPendingRequests={setPendingRequests} approvedRequests={approvedRequests} setApprovedRequests={setApprovedRequests} />
            )}
        </div>
    );
};

export default AdminDashboard;
