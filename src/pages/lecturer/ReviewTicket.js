import React, {useState, useEffect, act} from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import {documentService} from "../../services/documentService";
import '../../style/TicketsDetail.css';
import { all } from "axios";

const ReviewTicket = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        loadTicketData();
    }, [id]);

    const loadTicketData = async () => {
        try {
            const [ticketResponse, documentResponse] = await Promise.all([
                ticketService.getTicketById(id),
                documentService.getDocumentByTicketId(id)
            ]);

            const ticketData = ticketResponse.data.data || ticketResponse.data;
            setTicket(ticketData);
            
            const docs = documentResponse.data.data || documentResponse.data || [];
            setDocuments(Array.isArray(docs) ? docs : []);
            
            setNotes(ticketData.lecturer_note || "");
        } catch (error) {
            console.error("Failed to load ticket data", error);
            setTicket(null);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (action) => {
        setActionLoading(true);
        try {
            await ticketService.reviewTicket(id, notes);
            alert('Tiket berhasil ditinjau');
            navigate('/lecturer/dashboard');
        } catch (error) {
            alert('Gagal meninjau tiket');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await ticketService.approveTicket(id, notes);
            alert('Tiket berhasil disetujui');
            navigate('/lecturer/dashboard');
        } catch (error) {
            alert('Gagal menyetujui tiket');
        } finally {
            setActionLoading(false);
            setShowApproveModal(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert ('Harap berikan alasan penolakan');
            return;
        }

        setActionLoading(true);
        try {
        await ticketService.rejectTicket(id, rejectionReason);
        alert('Tiket ditolak');
        navigate('/lecturer/tickets');
        } catch (err) {
        alert('Gagal menolak tiket');
        } finally {
        setActionLoading(false);
        setShowRejectModal(false);
        }
    };

    const handleDownload = async (documentId, filename) => {
        try {
            const blob = await documentService.downloadDocument(documentId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Gagal mengunduh dokumen');
        }
    };

    if (loading) return <div className="loading">Memuat...</div>;
    if (!ticket) return <div className="error">Tiket tidak ditemukan</div>;

    const canTakeAction = ticket.status === 'pending' || ticket.status === 'in_review';

  return (
    <div className="ticket-detail-container">
      <div className="detail-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="ticket-number">Tiket #{ticket.ticket_number}</p>
          <p>Mahasiswa: {ticket.student?.name} ({ticket.student?.nim})</p>
        </div>
        <Link to="/lecturer/tickets" className="btn-secondary">
          Kembali
        </Link>
      </div>

      <div className="detail-content">
        {/* Ticket Information */}
        <div className="detail-section">
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className="badge">{ticket.status}</span>
            </div>
            <div className="info-item">
              <label>Prioritas</label>
              <span className="badge">{ticket.priority}</span>
            </div>
            <div className="info-item">
              <label>Jenis</label>
              <span>{ticket.type.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <label>Dibuat Pada</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3>Deskripsi</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {/* Documents */}
        <div className="detail-section">
          <h3>Dokumen</h3>
          {documents.length === 0 ? (
            <p>Tidak ada dokumen terlampir</p>
          ) : (
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <span className="document-name">{doc.file_name}</span>
                    <span className="document-meta">
                      {(doc.file_size / 1024).toFixed(2)} KB
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

        {/* Lecturer Notes */}
        {canTakeAction && (
          <div className="detail-section">
            <h3>Catatan Anda</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan Anda di sini..."
              rows="4"
              className="form-textarea"
            />
          </div>
        )}

        {/* Actions */}
        {canTakeAction && (
          <div className="action-buttons">
            {ticket.status === 'pending' && (
              <button
                onClick={handleReview}
                className="btn-info"
                disabled={actionLoading}
              >
                Pindahkan ke Tinjau
              </button>
            )}
            <button
              onClick={() => setShowApproveModal(true)}
              className="btn-success"
              disabled={actionLoading}
            >
              Setujui
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="btn-danger"
              disabled={actionLoading}
            >
              Tolak
            </button>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Setujui Tiket</h2>
            <p>Apakah Anda yakin ingin menyetujui tiket ini?</p>
            <div className="modal-actions">
              <button onClick={handleApprove} className="btn-success" disabled={actionLoading}>
                {actionLoading ? 'Memproses...' : 'Ya, Setujui'}
              </button>
              <button onClick={() => setShowApproveModal(false)} className="btn-secondary">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tolak Tiket</h2>
            <p>Harap berikan alasan penolakan:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Alasan penolakan..."
              rows="4"
              className="form-textarea"
            />
            <div className="modal-actions">
              <button onClick={handleReject} className="btn-danger" disabled={actionLoading}>
                {actionLoading ? 'Memproses...' : 'Tolak Tiket'}
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-secondary">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTicket;