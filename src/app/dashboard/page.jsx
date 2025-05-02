'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const userToken = localStorage.getItem('userToken');
            if (!userToken) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/v1/users/verifyToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: userToken }),
                });

                const data = await response.json();
                if (data.error) {
                    router.push('/login');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                router.push('/login');
            }
        };

        verifyToken();
    }, [router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
        </div>
    );
}