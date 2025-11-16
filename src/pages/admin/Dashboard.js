import React, {useState, useEffect, use} from "react";
import {link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {ticketService} from "../../services/ticketService";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
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
                ticketService.getTickets({status: 'approved', page: 1, per_page: 5}),
            ]);

            setStatistics (statsResponse.data);
            setTickets (ticketResponse.data.data);
        } catch (error) {
            console.error('failed to load dashboard data', error)
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
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
        <button onClick={logout} className="btn-danger">Logout</button>
      </header>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-number">{statistics?.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{statistics?.by_status?.pending || 0}</p>
        </div>
        <div className="stat-card">
          <h3>In Review</h3>
          <p className="stat-number">{statistics?.by_status?.in_review || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-number">{statistics?.by_status?.approved || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{statistics?.by_status?.completed || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number">{statistics?.by_status?.rejected || 0}</p>
        </div>
      </div>

      {/* Priority Statistics */}
      {statistics?.by_priority && (
        <div className="detail-section">
          <h2>Tickets by Priority</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>High Priority</h3>
              <p className="stat-number">{statistics.by_priority.high || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Medium Priority</h3>
              <p className="stat-number">{statistics.by_priority.medium || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Low Priority</h3>
              <p className="stat-number">{statistics.by_priority.low || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/tickets?status=approved" className="btn-primary">
          Process Approved Tickets
        </Link>
        <Link to="/admin/tickets" className="btn-secondary">
          View All Tickets
        </Link>
      </div>

      {/* Approved Tickets */}
      <div className="recent-tickets">
        <h2>Recently Approved Tickets</h2>
        {tickets.length === 0 ? (
          <p>No approved tickets waiting for completion.</p>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <h3>{ticket.title}</h3>
                    <p className="ticket-student">
                      Student: {ticket.student?.name} | Lecturer: {ticket.lecturer?.name}
                    </p>
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
                  <Link to={`/admin/tickets/${ticket.id}`} className="btn-link">
                    Process →
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

export default AdminDashboard;