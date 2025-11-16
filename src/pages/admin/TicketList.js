import React, {useState, useEffect} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import "../../style/TicketList.css";

const AdminTicketList = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        status: searchParams.get("status") || '',
        priority: '',
        type : '',
        search : '',
        page: 1,
        per_page: 15,
    });

    useEffect(() => {
        loadTickets();
    }, [filters]);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getTickets(filters);
            setTickets(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            });
        } catch (error) {
            console.error("Failed to load tickets", error);
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

    const handlePageChange = (newPage) => {
        setFilters({...filters, page:  newPage});
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) {
            return;
        try {
            await ticketService.deleteTicket(ticketId);
            alert("Ticket deleted successfully");
            loadTickets();
        } catch (error) {
            alert("Failed to delete ticket");
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
                <h1>All Tickets (Admin)</h1>
                <Link to="/admin/dashboard" className="btn-secondary">
                Back to Dashboard
                </Link>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <input
                type="text"
                name="search"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
                />

                <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                </select>

                <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>

                <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="surat_keterangan">Surat Keterangan</option>
                <option value="surat_rekomendasi">Surat Rekomendasi</option>
                <option value="ijin">Ijin</option>
                <option value="lainnya">Lainnya</option>
                </select>
            </div>

            {/* Ticket List */}
            {loading ? (
                <div className="loading">Loading tickets...</div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">
                <p>No tickets found</p>
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
                        <p className="ticket-student">
                        Student: {ticket.student?.name} | Lecturer: {ticket.lecturer?.name}
                        </p>
                        
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
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link to={`/admin/tickets/${ticket.id}`} className="btn-link">
                            View Details →
                            </Link>
                            <button 
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="btn-danger-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                            Delete
                            </button>
                        </div>
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
                        Previous
                    </button>
                    
                    <span className="page-info">
                        Page {pagination.current_page} of {pagination.last_page} 
                        ({pagination.total} tickets)
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="btn-secondary"
                    >
                        Next
                    </button>
                    </div>
                )}
                </>
            )}
            </div>
        );
    };
};

export default AdminTicketList;