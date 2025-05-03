import React, { useState, useEffect } from 'react';
import PendingAgents from './PendingAgents';
import Agents from './Agents';

const AdminDashboard = ({ user }) => {
    const [pendingAgents, setPendingAgents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [showPendingAgents, setShowPendingAgents] = useState(false);
    const [showAllAgents, setShowAllAgents] = useState(false);

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

        fetchAgents();
    }, []);

    return (
        <div>
            <button
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => {
                    setShowPendingAgents((prev) => !prev);
                    setShowAllAgents(false);  
                }}
            >
                {showPendingAgents ? 'Hide Pending Agents' : 'Show Pending Agents'}
            </button>

            <button
                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition ml-4"
                onClick={() => {
                    setShowAllAgents((prev) => !prev);
                    setShowPendingAgents(false);  
                }}
            >
                {showAllAgents ? 'Hide All Agents' : 'Show All Agents'}
            </button>

            {showPendingAgents && (
                <PendingAgents user={user} pendingAgents={pendingAgents} setPendingAgents={setPendingAgents} />
            )}

            {showAllAgents && (
                <Agents user={user} agents={agents} setAgents={setAgents} />
            )}
        </div>
    );
};

export default AdminDashboard;
