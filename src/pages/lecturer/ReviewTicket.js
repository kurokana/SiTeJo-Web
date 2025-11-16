import React, {useState, useEffect, act} from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import {documentService} from "../../services/documentService";
import '../../styles/TicketsDetail.css';
import { all } from "axios";

const ReviewTicket = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionsLoading, setActionsLoading] = useState(false);
    const [note, setNote] = useState("");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectedReason, setRejectedReason] = useState("");

    UseEffect(() => {
        loadTicketData();
    }, [id]);

    const loadTicketDetail = async () => {
        try {
            const [ticketResponse, documentResponse] = await Promise.all([
                ticketService.getTicketById(id),
                documentService.getDocumentByTicketId(id)
            ]);

            setTicket(ticketResponse.data);
            setDocument(documentResponse.data);
            setNotes(ticketResponse.data.lecturer_note || "");
        } catch (error) {
            console.error("Failed to load ticket data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (action) => {
        setActionsLoading(true);
        try {
            await ticketService.reviewTicket(id, notes);
            alert('Tikect moved to review"(id, notes)');
            navigate('/lecturer/dashboard');
        } catch (error) {
            allert('Failed to review ticket');
        } finally {
            setActionsLoading(false);
        }
    };

    const handleApprove = async () => {
        setActionsLoading(true);
        try {
            await ticketService.approveTicket(id, note);
            alert('Ticket approved successfully');
            navigate('/lecturer/dashboard');
        } catch (error) {
            alert('Failed to approve ticket');
        } finally {
            setActionsLoading(false);
            setShowApproveModal(false);
        }
    };

    const handleReject = async () => {
        if (!rejectedReason.trim()) {
            alert ('Please provide a reason for rejection');
            return;
        }

        setActionLoading(true);
        try {
        await ticketService.rejectTicket(id, rejectionReason);
        alert('Ticket rejected');
        navigate('/lecturer/tickets');
        } catch (err) {
        alert('Failed to reject ticket');
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
            alert('Failed to download document');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!ticket) return <div className="error">Ticket not found</div>;

    const canTakeAction = ticket.status === 'pending' || ticket.status === 'in_review';

  return (
    <div className="ticket-detail-container">
      <div className="detail-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="ticket-number">Ticket #{ticket.ticket_number}</p>
          <p>Student: {ticket.student?.name} ({ticket.student?.nim})</p>
        </div>
        <Link to="/lecturer/tickets" className="btn-secondary">
          Back to List
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
              <label>Priority</label>
              <span className="badge">{ticket.priority}</span>
            </div>
            <div className="info-item">
              <label>Type</label>
              <span>{ticket.type.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <label>Created At</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3>Description</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {/* Documents */}
        <div className="detail-section">
          <h3>Documents</h3>
          {documents.length === 0 ? (
            <p>No documents attached</p>
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
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lecturer Notes */}
        {canTakeAction && (
          <div className="detail-section">
            <h3>Your Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
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
                Move to Review
              </button>
            )}
            <button
              onClick={() => setShowApproveModal(true)}
              className="btn-success"
              disabled={actionLoading}
            >
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="btn-danger"
              disabled={actionLoading}
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Approve Ticket</h2>
            <p>Are you sure you want to approve this ticket?</p>
            <div className="modal-actions">
              <button onClick={handleApprove} className="btn-success" disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Yes, Approve'}
              </button>
              <button onClick={() => setShowApproveModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reject Ticket</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason..."
              rows="4"
              className="form-textarea"
            />
            <div className="modal-actions">
              <button onClick={handleReject} className="btn-danger" disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Reject Ticket'}
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTicket;