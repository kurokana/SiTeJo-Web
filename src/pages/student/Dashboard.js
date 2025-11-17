import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import '../../style/Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, ticketsResponse] = await Promise.all([
        ticketService.getStatistics(),
        ticketService.getTickets({ page: 1, per_page: 5 })
      ]);

      setStatistics(statsResponse.data);
      setTickets(ticketsResponse.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Student Dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
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
          <h3>Approved</h3>
          <p className="stat-number">{statistics?.by_status?.approved || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{statistics?.by_status?.completed || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/student/create-ticket" className="btn-primary">
          Create New Ticket
        </Link>
        <Link to="/student/tickets" className="btn-secondary">
          View All Tickets
        </Link>
      </div>

      {/* Recent Tickets */}
      <div className="recent-tickets">
        <h2>Recent Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found. Create your first ticket!</p>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <h3>{ticket.title}</h3>
                  <span className={`badge ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="ticket-number">#{ticket.ticket_number}</p>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-footer">
                  <span>Priority: {ticket.priority}</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  <Link to={`/student/tickets/${ticket.id}`}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;