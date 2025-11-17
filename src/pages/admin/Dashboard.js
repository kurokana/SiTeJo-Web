import React, {useState, useEffect, use} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {ticketService} from "../../services/ticketService";
import "../../style/Dashboard.css";

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

            setStatistics (statsResponse.data.data || statsResponse.data);
            
            // Handle different response structures
            const ticketsData = ticketResponse.data.data?.data || ticketResponse.data.data || ticketResponse.data || [];
            setTickets (Array.isArray(ticketsData) ? ticketsData : []);
        } catch (error) {
            console.error('gagal memuat data beranda', error);
            setStatistics(null);
            setTickets([]);
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
        return <div className="loading">Memuat...</div>;
    }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Beranda Admin</h1>
          <p>Selamat datang, {user?.name}!</p>
        </div>
        <button onClick={logout} className="btn-danger">Logout</button>
      </header>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tiket</h3>
          <p className="stat-number">{statistics?.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Menunggu</h3>
          <p className="stat-number">{statistics?.by_status?.pending || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Sedang Ditinjau</h3>
          <p className="stat-number">{statistics?.by_status?.in_review || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Disetujui</h3>
          <p className="stat-number">{statistics?.by_status?.approved || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Selesai</h3>
          <p className="stat-number">{statistics?.by_status?.completed || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Ditolak</h3>
          <p className="stat-number">{statistics?.by_status?.rejected || 0}</p>
        </div>
      </div>

      {/* Priority Statistics */}
      {statistics?.by_priority && (
        <div className="detail-section">
          <h2>Tiket Berdasarkan Prioritas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Prioritas Tinggi</h3>
              <p className="stat-number">{statistics.by_priority.high || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Prioritas Sedang</h3>
              <p className="stat-number">{statistics.by_priority.medium || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Prioritas Rendah</h3>
              <p className="stat-number">{statistics.by_priority.low || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/tickets?status=approved" className="btn-primary">
          Proses Tiket Disetujui
        </Link>
        <Link to="/admin/tickets" className="btn-secondary">
          Lihat Semua Tiket
        </Link>
      </div>

      {/* Approved Tickets */}
      <div className="recent-tickets">
        <h2>Tiket yang Baru Disetujui</h2>
        {tickets.length === 0 ? (
          <p>Tidak ada tiket yang disetujui menunggu penyelesaian.</p>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <h3>{ticket.title}</h3>
                    <p className="ticket-student">
                      Mahasiswa: {ticket.student?.name} | Dosen: {ticket.lecturer?.name}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="ticket-number">#{ticket.ticket_number}</p>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-footer">
                  <span>Prioritas: {ticket.priority}</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  <Link to={`/admin/tickets/${ticket.id}`} className="btn-link">
                    Proses →
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