import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {ticketService} from "../../services/ticketService";
import {documentService} from "../../services/documentService";
import '../../style/TicketsDetail.css';

const AdminTicketDetail = () => {
    const {id} = useParams();
    const [ticket, setTicket] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Modal states
    const [showSendModal, setShowSendModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const loadTicketDetail = async () => {
        try {
            const [ticketResponse, documentResponse] = await Promise.all ([
                ticketService.getTicketById(id),
                documentService.getDocumentsByTicket(id)
            ]);
            
            let ticketData = ticketResponse.data;
            if (ticketData && ticketData.data) {
                ticketData = ticketData.data;
            }
            
            setTicket(ticketData);
            
            const docs = documentResponse.data.data || documentResponse.data || [];
            setDocuments(Array.isArray(docs) ? docs : []);
            setAdminNotes(ticketData?.admin_notes || "");
        } catch (error) {
            setTicket(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTicketDetail();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSendToLecturer = async () => {
        setActionLoading(true);
        try {
            await ticketService.sendToLecturer(id, adminNotes);
            alert('Tiket berhasil dikirim ke dosen!');
            loadTicketDetail();
        } catch (err) {
            alert('Gagal mengirim tiket ke dosen');
        } finally {
            setActionLoading(false);
            setShowSendModal(false);
        }
    };

    const handleComplete = async () => {
        setActionLoading(true);
        try {
            await ticketService.completeTicket(id, adminNotes);
            alert('Tiket berhasil diselesaikan!');
            loadTicketDetail();
        } catch (err) {
            alert('Gagal menyelesaikan tiket');
        } finally {
            setActionLoading(false);
            setShowCompleteModal(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Harap berikan alasan penolakan');
            return;
        }

        setActionLoading(true);
        try {
            await ticketService.adminRejectTicket(id, rejectionReason);
            alert('Tiket berhasil ditolak');
            loadTicketDetail();
        } catch (err) {
            alert('Gagal menolak tiket');
        } finally {
            setActionLoading(false);
            setShowRejectModal(false);
        }
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            const response = await documentService.downloadDocument(documentId);
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Gagal mengunduh dokumen');
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu', class: 'badge-warning', icon: '⏳' },
            in_review: { label: 'Sedang Ditinjau', class: 'badge-info', icon: '👁️' },
            approved: { label: 'Disetujui', class: 'badge-success', icon: '✓' },
            rejected: { label: 'Ditolak', class: 'badge-danger', icon: '✗' },
            completed: { label: 'Selesai', class: 'badge-secondary', icon: '✓✓' }
        };
        return statusMap[status] || { label: status, class: 'badge-default', icon: '•' };
    };

    const getPriorityInfo = (priority) => {
        const priorityMap = {
            low: { label: 'Rendah', class: 'badge-secondary' },
            medium: { label: 'Sedang', class: 'badge-warning' },
            high: { label: 'Tinggi', class: 'badge-danger' }
        };
        return priorityMap[priority] || { label: priority, class: 'badge-default' };
    };

    const getWorkflowSteps = () => {
        const steps = [
            { key: 'pending', label: 'Tiket Dibuat' },
            { key: 'in_review', label: 'Dikirim ke Dosen' },
            { key: 'approved', label: 'Disetujui Dosen' },
            { key: 'completed', label: 'Selesai' }
        ];

        const statusOrder = ['pending', 'in_review', 'approved', 'completed'];
        const currentIndex = statusOrder.indexOf(ticket?.status);

        return steps.map((step, index) => ({
            ...step,
            active: index <= currentIndex,
            current: step.key === ticket?.status
        }));
    };

    if (loading) {
        return (
            <div className="ticket-detail-container">
                <div className="loading">Memuat detail tiket...</div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="ticket-detail-container">
                <div className="empty-state">
                    <p>Tiket tidak ditemukan</p>
                    <Link to="/admin/tickets" className="btn-secondary">Kembali ke Daftar Tiket</Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(ticket.status);
    const priorityInfo = getPriorityInfo(ticket.priority);
    const canSendToLecturer = ticket.status === 'pending';
    const canComplete = ticket.status === 'approved';
    const canReject = ticket.status === 'pending' || ticket.status === 'in_review';

    return (
        <div className="ticket-detail-container">
            {/* Header */}
            <div className="detail-header">
                <div>
                    <h1>{ticket.title}</h1>
                    <p className="ticket-number">#{ticket.ticket_number}</p>
                </div>
                <div className="header-actions">
                    <Link to="/admin/tickets" className="btn-secondary">
                        ← Kembali
                    </Link>
                </div>
            </div>

            {/* Workflow Progress */}
            <div className="workflow-progress">
                <h3>Status Workflow</h3>
                <div className="workflow-steps">
                    {getWorkflowSteps().map((step, index) => (
                        <div key={step.key} className={`workflow-step ${step.active ? 'active' : ''} ${step.current ? 'current' : ''}`}>
                            <div className="step-indicator">
                                <span className="step-number">{index + 1}</span>
                            </div>
                            <div className="step-label">{step.label}</div>
                            {index < 3 && <div className="step-connector"></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="detail-content">
                {/* Main Info Cards */}
                <div className="info-cards-grid">
                    {/* Status Card */}
                    <div className="info-card">
                        <div className="card-icon status-icon">{statusInfo.icon}</div>
                        <div className="card-content">
                            <div className="card-label">Status</div>
                            <span className={`badge ${statusInfo.class}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Priority Card */}
                    <div className="info-card">
                        <div className="card-icon">⚡</div>
                        <div className="card-content">
                            <div className="card-label">Prioritas</div>
                            <span className={`badge ${priorityInfo.class}`}>
                                {priorityInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Type Card */}
                    <div className="info-card">
                        <div className="card-icon">📋</div>
                        <div className="card-content">
                            <div className="card-label">Jenis</div>
                            <span className="card-value">{ticket.type.replace('_', ' ')}</span>
                        </div>
                    </div>

                    {/* Date Card */}
                    <div className="info-card">
                        <div className="card-icon">📅</div>
                        <div className="card-content">
                            <div className="card-label">Dibuat</div>
                            <span className="card-value">{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Ticket Information */}
                <div className="detail-section">
                    <h3>Informasi Lengkap</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Mahasiswa</label>
                            <span>{ticket.student?.name} ({ticket.student?.nim_nip})</span>
                        </div>
                        <div className="info-item">
                            <label>Dosen Tujuan</label>
                            <span>{ticket.lecturer?.name}</span>
                        </div>
                        {ticket.reviewed_at && (
                            <div className="info-item">
                                <label>Ditinjau Pada</label>
                                <span>{new Date(ticket.reviewed_at).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {ticket.approved_at && (
                            <div className="info-item">
                                <label>Disetujui Pada</label>
                                <span>{new Date(ticket.approved_at).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {ticket.completed_at && (
                            <div className="info-item">
                                <label>Diselesaikan Pada</label>
                                <span>{new Date(ticket.completed_at).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="detail-section">
                    <h3>Deskripsi</h3>
                    <p className="description-text">{ticket.description}</p>
                </div>

                {/* Lecturer Notes */}
                {ticket.lecturer_notes && (
                    <div className="detail-section notes-section lecturer-notes">
                        <div className="notes-header">
                            <h3>📝 Catatan Dosen</h3>
                        </div>
                        <p className="notes-text">{ticket.lecturer_notes}</p>
                    </div>
                )}

                {/* Rejection Reason */}
                {ticket.rejection_reason && (
                    <div className="detail-section notes-section rejection-notes">
                        <div className="notes-header">
                            <h3>❌ Alasan Penolakan</h3>
                        </div>
                        <p className="notes-text">{ticket.rejection_reason}</p>
                    </div>
                )}

                {/* Admin Notes Section */}
                {ticket.status === 'completed' && ticket.admin_notes ? (
                    <div className="detail-section notes-section admin-notes">
                        <div className="notes-header">
                            <h3>✓ Catatan Admin</h3>
                        </div>
                        <p className="notes-text">{ticket.admin_notes}</p>
                    </div>
                ) : (canSendToLecturer || canComplete) && (
                    <div className="detail-section">
                        <h3>Catatan Admin</h3>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Tambahkan catatan (opsional)..."
                            rows="4"
                            className="form-textarea"
                        />
                    </div>
                )}

                {/* Documents */}
                <div className="detail-section">
                    <h3>Dokumen Terlampir</h3>
                    {documents.length === 0 ? (
                        <p className="empty-message">Tidak ada dokumen terlampir</p>
                    ) : (
                        <div className="documents-list">
                            {documents.map((doc) => (
                                <div key={doc.id} className="document-item">
                                    <div className="document-icon">📄</div>
                                    <div className="document-info">
                                        <span className="document-name">{doc.file_name}</span>
                                        <span className="document-meta">
                                            {doc.document_type?.replace('_', ' ')} • 
                                            {(doc.file_size / 1024).toFixed(2)} KB •
                                            {new Date(doc.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.file_name)}
                                        className="btn-download"
                                    >
                                        ⬇ Unduh
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    {canSendToLecturer && (
                        <button
                            onClick={() => setShowSendModal(true)}
                            className="btn-primary"
                            disabled={actionLoading}
                        >
                            📤 Kirim ke Dosen
                        </button>
                    )}
                    
                    {canComplete && (
                        <button
                            onClick={() => setShowCompleteModal(true)}
                            className="btn-success"
                            disabled={actionLoading}
                        >
                            ✓ Tandai Selesai
                        </button>
                    )}
                    
                    {canReject && (
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="btn-danger"
                            disabled={actionLoading}
                        >
                            ✗ Tolak Tiket
                        </button>
                    )}
                </div>
            </div>

            {/* Send to Lecturer Modal */}
            {showSendModal && (
                <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Kirim Tiket ke Dosen</h2>
                            <button className="modal-close" onClick={() => setShowSendModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Tiket akan dikirim ke <strong>{ticket.lecturer?.name}</strong> untuk ditinjau dan disetujui.</p>
                            <div className="form-group">
                                <label>Catatan untuk Dosen (Opsional)</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    rows="4"
                                    className="form-textarea"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={handleSendToLecturer} 
                                className="btn-primary" 
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Mengirim...' : '📤 Kirim'}
                            </button>
                            <button 
                                onClick={() => setShowSendModal(false)} 
                                className="btn-secondary"
                                disabled={actionLoading}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="modal-overlay" onClick={() => setShowCompleteModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Selesaikan Tiket</h2>
                            <button className="modal-close" onClick={() => setShowCompleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Tiket ini sudah disetujui oleh dosen. Apakah Anda yakin ingin menandai tiket sebagai <strong>selesai</strong>?</p>
                            <div className="form-group">
                                <label>Catatan Penyelesaian (Opsional)</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Tambahkan catatan penyelesaian..."
                                    rows="4"
                                    className="form-textarea"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={handleComplete} 
                                className="btn-success" 
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Memproses...' : '✓ Selesaikan'}
                            </button>
                            <button 
                                onClick={() => setShowCompleteModal(false)} 
                                className="btn-secondary"
                                disabled={actionLoading}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Tolak Tiket</h2>
                            <button className="modal-close" onClick={() => setShowRejectModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Tiket yang ditolak dapat direvisi kembali oleh mahasiswa.</p>
                            <div className="form-group">
                                <label>Alasan Penolakan <span style={{color: '#f56565'}}>*</span></label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Jelaskan alasan penolakan tiket ini..."
                                    rows="4"
                                    className="form-textarea"
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={handleReject} 
                                className="btn-danger" 
                                disabled={actionLoading || !rejectionReason.trim()}
                            >
                                {actionLoading ? 'Memproses...' : '✗ Tolak Tiket'}
                            </button>
                            <button 
                                onClick={() => setShowRejectModal(false)} 
                                className="btn-secondary"
                                disabled={actionLoading}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTicketDetail;
