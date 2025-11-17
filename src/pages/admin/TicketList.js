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

    const handlePageChange = (newPage) => {
        setFilters({...filters, page:  newPage});
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus tiket ini?")) {
            return;
        try {
            await ticketService.deleteTicket(ticketId);
            alert("Tiket berhasil dihapus");
            loadTickets();
        } catch (error) {
            alert("Gagal menghapus tiket");
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
                <h1>Semua Tiket (Admin)</h1>
                <Link to="/admin/dashboard" className="btn-secondary">
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

                <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">Semua Jenis</option>
                <option value="surat_keterangan">Surat Keterangan</option>
                <option value="surat_rekomendasi">Surat Rekomendasi</option>
                <option value="ijin">Ijin</option>
                <option value="lainnya">Lainnya</option>
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
                        <p className="ticket-student">
                        Mahasiswa: {ticket.student?.name} | Dosen: {ticket.lecturer?.name}
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
                            Lihat Detail →
                            </Link>
                            <button 
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="btn-danger-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                            Hapus
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
                        Sebelumnya
                    </button>
                    
                    <span className="page-info">
                        Halaman {pagination.current_page} dari {pagination.last_page} 
                        ({pagination.total} tiket)
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
};

export default AdminTicketList;