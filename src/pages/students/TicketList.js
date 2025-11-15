import React, {userState, useEffect} from "react";
import { Link } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import '../../styles/TicketList.css';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState({
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
            const response = await ticketService.getTickets(fileters);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total_pages,
            });
        } catch (error) {
            console.error("Failed to load tickets", err);
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
            low: 'badge-success',
            medium: 'badge-warning',
            high: 'badge-danger'
        };
        return badges[priority] || 'badge-default';
    };

    return (
        <div className="ticket-list-container">
            <div className="list-header">
                <h1>My Ticket</h1>
                <Link to="/student/tickets/create" className="btn-primary">Create New Ticket</Link>
            </div>

            <div className="filters-section">
                <input
                    type="text"
                    name="search"
                    placeholder="Search tickets...."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="search-input"
                />

                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>

                <select name="priority" value={filters.priority} onChange={handleFilterChange} className="filter-select">
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
                    <option value="">All Types</option>
                    <option value="surat-rekomendasi">Surat Rekomendasi</option>
                    <option value="surat-keterangan">Surat Keterangan</option>
                    <option value="izin-penelitian">Izin</option>
                    <option value="lainnya">Lainnya</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading tickets...</div>
            ) : ( tickets.length === 0 ? (
                <div className="empty-state">
                    <p>No tickets found.</p>
                    <Link to="/student/tickets/create" className="btn-primary">Create your first ticket</Link>
                </div>
            ) : (
                <>
                <div className="ticket-grid">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-item">
                            <div className="ticket-item-header">
                                <h3>{ticket.title}</h3>
                                <span className={`badge ${getStatusBadge(ticket.status)}`}></span>
                            </div>
                            <p className="ticket-number">#{ticket.ticket_number}</p>
                            <p className="ticket-description">
                                {ticket.description.substring(0, 100)}
                                {ticket.description.length > 100 ? '...' : ''}
                            </p>

                            <div className="ticket-footer">
                                <span className="ticket-date">
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </span>
                                <link to={`/student/tickets/${ticket.id}`} className="btn-secondary btn-sm">
                                    View Details
                                </link>
                            </div>
                        </div>
                    ))}
                </div>

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
                            page {pagination.current_page} of {pagination.last_page}
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
            ))}
            </div>
     );
};

export default TicketList;