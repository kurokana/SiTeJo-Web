import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import '../../style/TicketList.css';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        type: '',
        search: '',
        page: 1, 
        per_page: 10,
    });

    useEffect(() => {
        loadTickets();
    }, [filters]);  
    
    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getTickets(filters);
            setTickets(response.data.data || []);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            });
        } catch (error) {
            console.error("Failed to load tickets", error);
            setTickets([]);
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
        return badges[status] || 'badge-warning';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            low: 'badge-success',
            medium: 'badge-warning',
            high: 'badge-danger'
        };
        return badges[priority] || 'badge-warning';
    };

    if (loading) {
        return (
            <div className="ticket-list-container">
                <div className="loading">Loading tickets...</div>
            </div>
        );
    }

    return (
        <div className="ticket-list-container">
            {/* Header */}
            <div className="ticket-header">
                <h1>My Tickets</h1>
                <Link to="/student/create-ticket" className="btn-primary">
                    Create New Ticket
                </Link>
            </div>

            {/* Filters */}
            <div className="filter-section">
                <input
                    type="text"
                    name="search"
                    placeholder="Search tickets..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="search-input"
                />

                <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>

                <select 
                    name="priority" 
                    value={filters.priority} 
                    onChange={handleFilterChange}
                >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <select 
                    name="type" 
                    value={filters.type} 
                    onChange={handleFilterChange}
                >
                    <option value="">All Types</option>
                    <option value="surat-rekomendasi">Surat Rekomendasi</option>
                    <option value="surat-keterangan">Surat Keterangan</option>
                    <option value="izin-penelitian">Izin Penelitian</option>
                    <option value="lainnya">Lainnya</option>
                </select>
            </div>

            {/* Tickets List */}
            {tickets.length === 0 ? (
                <div className="empty-state">
                    <p>No tickets found</p>
                    <Link to="/student/create-ticket" className="btn-primary">
                        Create Your First Ticket
                    </Link>
                </div>
            ) : (
                <>
                    <div className="tickets-grid">
                        {tickets.map(ticket => (
                            <Link 
                                key={ticket.id} 
                                to={`/student/tickets/${ticket.id}`} 
                                className="ticket-card"
                            >
                                <div className="ticket-header">
                                    <h3>{ticket.title}</h3>
                                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                
                                <p className="ticket-number">#{ticket.ticket_number}</p>
                                
                                <p className="ticket-description">
                                    {ticket.description?.substring(0, 100)}
                                    {ticket.description?.length > 100 ? '...' : ''}
                                </p>

                                <div className="ticket-footer">
                                    <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className="ticket-date">
                                        {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </Link>
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

export default TicketList;