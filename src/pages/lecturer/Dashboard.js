import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {ticketService} from "../../services/ticketService";
import "../../style/Dashboard.css";

const LecturerDashboard = () => {
    const {user, logout} = useAuth();
    const [statistics, setStatistics] = useState (null);
    const [tickets, setTickets] = useState ([]);
    const [loading, setLoading] = useState (true);

    useEffect (() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsResponse, ticketResponse] = await Promise.all ([
                ticketService.getStatistics(),
                ticketService.getTickets({status: 'pending', page: 1, per_page: 5}),
            ]);

            setStatistics (statsResponse.data);
            setTickets (ticketResponse.data.data);
        } catch (error) {
            console.error('failed to load dashboard data')
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            in_review: 'badge-info',
            approved: 'badge-success',
            rejected: 'badge-danger',
            completed: 'badge-secondary'
        };
        return badges[status] || 'badge-default';
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
        <header className="dashboard-header">
            <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Lecturer Dashboard</p>
            </div>
            <button onClick={logout} className="btn-danger">Logout</button>
        </header>

        {/* Statistics */}
        <div className="stats-grid">
            <div className="stat-card">
            <h3>Total Tickets</h3>
            <p className="stat-number">{statistics?.total || 0}</p>
            </div>
            <div className="stat-card stat-pending">
            <h3>Pending Review</h3>
            <p className="stat-number">{statistics?.by_status?.pending || 0}</p>
            </div>
            <div className="stat-card stat-review">
            <h3>In Review</h3>
            <p className="stat-number">{statistics?.by_status?.in_review || 0}</p>
            </div>
            <div className="stat-card stat-approved">
            <h3>Approved</h3>
            <p className="stat-number">{statistics?.by_status?.approved || 0}</p>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
            <Link to="/lecturer/tickets?status=pending" className="btn-primary">
            Review Pending Tickets
            </Link>
            <Link to="/lecturer/tickets" className="btn-secondary">
            View All Tickets
            </Link>
        </div>

        {/* Pending Tickets */}
        <div className="recent-tickets">
            <h2>Pending Tickets Requiring Your Attention</h2>
            {tickets.length === 0 ? (
            <p>No pending tickets at the moment.</p>
            ) : (
            <div className="tickets-list">
                {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                    <div>
                        <h3>{ticket.title}</h3>
                        <p className="ticket-student">From: {ticket.student?.name}</p>
                    </div>
                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                    </span>
                    </div>
                    <p className="ticket-number">#{ticket.ticket_number}</p>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-footer">
                    <span>Priority: {ticket.priority}</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    <Link to={`/lecturer/tickets/${ticket.id}`} className="btn-link">
                        Review →
                    </Link>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
    };

    export default LecturerDashboard;