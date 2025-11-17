import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {ticketService} from "../../services/ticketService";
import {documentService} from "../../services/documentService";
import '../../style/TicketsDetail.css';

const AdminTicketDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const canComplete = ticket?.status === 'approved';

    useEffect(() => {
        loadTicketDetail();
    }, [id]);

    const loadTicketDetail = async () => {
        try {
            const [ticketResponse, documentResponse] = await Promise.all ([
                ticketService.getTicketById(id),
                documentService.getDocumentByTicketId(id)
            ]);

            setTicket(ticketResponse.data.data || ticketResponse.data);
            
            const docs = documentResponse.data.data || documentResponse.data || [];
            setDocuments(Array.isArray(docs) ? docs : []);
            setAdminNotes(ticketResponse.data.admin_note || "");
        } catch (error) {
            console.error("Failed to load ticket data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        setActionLoading(true);
        try {
        await ticketService.completeTicket(id, adminNotes);
        alert('Tiket berhasil diselesaikan!');
        navigate('/admin/tickets');
        } catch (err) {
        alert('Gagal menyelesaikan tiket');
        } finally {
        setActionLoading(false);
        setShowCompleteModal(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus tiket ini?")) {
            return;
        }

        try {
            await ticketService.deleteTicket(id);
            alert("Tiket berhasil dihapus");
            navigate('/admin/tickets');
        } catch (error) {
            alert("Gagal menghapus tiket");
        }
    };

    const handleDownload = (documentId, fileName) => {
        try {
            const blob = documentService.downloadDocument(documentId);
            const url = window.URL.createObjectURL(blob);
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

      return (
    <div className="ticket-detail-container">
      <div className="detail-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="ticket-number">Tiket #{ticket.ticket_number}</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/tickets" className="btn-secondary">
            Kembali
          </Link>
        </div>
      </div>

      <div className="detail-content">
        {/* Ticket Information */}
        <div className="detail-section">
          <h3>Informasi Tiket</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className={`badge ${getStatusBadge(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <label>Prioritas</label>
              <span className="badge">{ticket.priority.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <label>Jenis</label>
              <span>{ticket.type.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <label>Mahasiswa</label>
              <span>{ticket.student?.name} ({ticket.student?.nim})</span>
            </div>
            <div className="info-item">
              <label>Dosen</label>
              <span>{ticket.lecturer?.name}</span>
            </div>
            <div className="info-item">
              <label>Dibuat Pada</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            {ticket.reviewed_at && (
              <div className="info-item">
                <label>Ditinjau Pada</label>
                <span>{new Date(ticket.reviewed_at).toLocaleString()}</span>
              </div>
            )}
            {ticket.completed_at && (
              <div className="info-item">
                <label>Diselesaikan Pada</label>
                <span>{new Date(ticket.completed_at).toLocaleString()}</span>
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
          <div className="detail-section alert-info">
            <h3>Catatan Dosen</h3>
            <p>{ticket.lecturer_notes}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {ticket.rejection_reason && (
          <div className="detail-section alert-danger">
            <h3>Alasan Penolakan</h3>
            <p>{ticket.rejection_reason}</p>
          </div>
        )}

        {/* Admin Notes */}
        {ticket.status === 'completed' && ticket.admin_notes ? (
          <div className="detail-section alert-info">
            <h3>Catatan Admin</h3>
            <p>{ticket.admin_notes}</p>
          </div>
        ) : canComplete && (
          <div className="detail-section">
            <h3>Catatan Admin</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Tambahkan catatan penyelesaian..."
              rows="4"
              className="form-textarea"
            />
          </div>
        )}

        {/* Documents */}
        <div className="detail-section">
          <h3>Dokumen</h3>
          {documents.length === 0 ? (
            <p className="empty-message">Tidak ada dokumen terlampir</p>
          ) : (
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <span className="document-name">{doc.file_name}</span>
                    <span className="document-meta">
                      {doc.document_type.replace('_', ' ')} • 
                      {(doc.file_size / 1024).toFixed(2)} KB •
                      Diunggah {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.id, doc.file_name)}
                    className="btn-link"
                  >
                    Unduh
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(canComplete || ticket.status !== 'completed') && (
          <div className="action-buttons">
            {canComplete && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="btn-success"
                disabled={actionLoading}
              >
                Tandai Sebagai Selesai
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn-danger"
              disabled={actionLoading}
            >
              Hapus Tiket
            </button>
          </div>
        )}
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Selesaikan Tiket</h2>
            <p>Apakah Anda yakin ingin menandai tiket ini sebagai selesai?</p>
            <div className="modal-actions">
              <button 
                onClick={handleComplete} 
                className="btn-success" 
                disabled={actionLoading}
              >
                {actionLoading ? 'Memproses...' : 'Ya, Selesaikan'}
              </button>
              <button 
                onClick={() => setShowCompleteModal(false)} 
                className="btn-secondary"
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