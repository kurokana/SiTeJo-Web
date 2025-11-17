import React, { useState, useEffect} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import "../../style/TicketList.css";

const LecturerTicketList = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        status: searchParams.get("status") || '',
        priority: searchParams.get('status') || '',
        search : 1,
        per_page: 10,
    });

    useEffect(() => {
        loadTickets();
    }, [filters]);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getTickets(filters);
            
            // Handle Laravel pagination structure: response.data.data contains pagination object
            const paginationData = response.data.data || response.data || {};
            const ticketsArray = paginationData.data || [];
            
            setTickets(Array.isArray(ticketsArray) ? ticketsArray : []);
            
            setPagination({
                current_page: paginationData.current_page || 1,
                last_page: paginationData.last_page || 1,
                total: paginationData.total || 0,
            });
        } catch (error) {
            console.error("Failed to load tickets", error);
            setTickets([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
            page: 1,
        });
    };

    const handlePerPageChange = (newPerPage) => {
        setFilters({...filters, per_page: newPerPage, page: 1});
    };

    const handlePageChange = (newPage) => {
        setFilters({...filters, page: newPage});
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

    const getPriorityBadge = (priority) => {
        const badges = {
            low: 'badge-secondary',
            medium: 'badge-warning',
            high: 'badge-danger',
        };
        return badges[priority] || 'badge-default';
    };

    return (
        <div className="ticket-list-container">
        <div className="list-header">
            <h1>Semua Tiket</h1>
            <Link to="/lecturer/dashboard" className="btn-secondary">
            Kembali ke Dashboard
            </Link>
        </div>

        {/* Filters */}
        <div className="filters-section">
            <input
            type="text"
            name="search"
            placeholder="Cari tiket..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
            />

            <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_review">Sedang Ditinjau</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="completed">Selesai</option>
            </select>

            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">Semua Prioritas</option>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            </select>
        </div>

        {/* Ticket List */}
        {loading ? (
            <div className="loading">Memuat tiket...</div>
        ) : tickets.length === 0 ? (
            <div className="empty-state">
            <p>Tidak ada tiket ditemukan</p>
            </div>
        ) : (
            <>
            <div className="tickets-grid">
                {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-item">
                    <div className="ticket-item-header">
                    <h3>{ticket.title}</h3>
                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    </div>
                    
                    <p className="ticket-number">#{ticket.ticket_number}</p>
                    <p className="ticket-student">Mahasiswa: {ticket.student?.name}</p>
                    
                    <p className="ticket-description">
                    {ticket.description.substring(0, 100)}
                    {ticket.description.length > 100 && '...'}
                    </p>
                    
                    <div className="ticket-meta">
                    <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                    </span>
                    <span className="ticket-type">{ticket.type.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="ticket-footer">
                    <span className="ticket-date">
                        {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    <Link to={`/lecturer/tickets/${ticket.id}`} className="btn-link">
                        Tinjau →
                    </Link>
                    </div>
                </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="pagination">
                <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="btn-secondary"
                >
                    Sebelumnya
                </button>
                
                <span className="page-info">
                    Halaman {pagination.current_page} dari {pagination.last_page}
                </span>
                
                <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="btn-secondary"
                >
                    Selanjutnya
                </button>
                </div>
            )}
            </>
        )}
        </div>
    );
    };

    export default LecturerTicketList;