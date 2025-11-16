import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {ticketService} from "../../services/ticketService";
import {documentService} from "../../services/documentService";
import '../../styles/TicketsDetail.css';

const AdminTicketDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionsLoading, setActionsLoading] = useState(false);
    const [adminNote, setAdminNote] = useState("");
    const [showCloseModal, setShowCloseModal] = useState(false);

    useEffect(() => {
        loadTicketDetail();
    }, [id]);

    const loadTicketDetail = async () => {
        try {
            const [ticketResponse, documentResponse] = await Promise.all ([
                ticketService.getTicketById(id),
                documentService.getDocumentByTicketId(id)
            ]);

            setTicket(ticketResponse.data);
            setDocument(documentResponse.data);
            setAdminNote(ticketResponse.data.admin_note || "");
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
      alert('Ticket completed successfully!');
      navigate('/admin/tickets');
    } catch (err) {
      alert('Failed to complete ticket');
    } finally {
      setActionLoading(false);
      setShowCompleteModal(false);
    }
  };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) {
            return;
        }

        try {
            await ticketService.deleteTicket(id);
            alert("Ticket deleted successfully");
            navigate('/admin/tickets');
        } catch (error) {
            alert("Failed to delete ticket");
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
            alert('Failed to download document');
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
          <p className="ticket-number">Ticket #{ticket.ticket_number}</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/tickets" className="btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="detail-content">
        {/* Ticket Information */}
        <div className="detail-section">
          <h3>Ticket Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className={`badge ${getStatusBadge(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <label>Priority</label>
              <span className="badge">{ticket.priority.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <label>Type</label>
              <span>{ticket.type.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <label>Student</label>
              <span>{ticket.student?.name} ({ticket.student?.nim})</span>
            </div>
            <div className="info-item">
              <label>Lecturer</label>
              <span>{ticket.lecturer?.name}</span>
            </div>
            <div className="info-item">
              <label>Created At</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            {ticket.reviewed_at && (
              <div className="info-item">
                <label>Reviewed At</label>
                <span>{new Date(ticket.reviewed_at).toLocaleString()}</span>
              </div>
            )}
            {ticket.completed_at && (
              <div className="info-item">
                <label>Completed At</label>
                <span>{new Date(ticket.completed_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3>Description</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {/* Lecturer Notes */}
        {ticket.lecturer_notes && (
          <div className="detail-section alert-info">
            <h3>Lecturer Notes</h3>
            <p>{ticket.lecturer_notes}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {ticket.rejection_reason && (
          <div className="detail-section alert-danger">
            <h3>Rejection Reason</h3>
            <p>{ticket.rejection_reason}</p>
          </div>
        )}

        {/* Admin Notes */}
        {ticket.status === 'completed' && ticket.admin_notes ? (
          <div className="detail-section alert-info">
            <h3>Admin Notes</h3>
            <p>{ticket.admin_notes}</p>
          </div>
        ) : canComplete && (
          <div className="detail-section">
            <h3>Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add completion notes..."
              rows="4"
              className="form-textarea"
            />
          </div>
        )}

        {/* Documents */}
        <div className="detail-section">
          <h3>Documents</h3>
          {documents.length === 0 ? (
            <p className="empty-message">No documents attached</p>
          ) : (
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <span className="document-name">{doc.file_name}</span>
                    <span className="document-meta">
                      {doc.document_type.replace('_', ' ')} • 
                      {(doc.file_size / 1024).toFixed(2)} KB •
                      Uploaded {new Date(doc.created_at).toLocaleDateString()}
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

        {/* Actions */}
        {(canComplete || ticket.status !== 'completed') && (
          <div className="action-buttons">
            {canComplete && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="btn-success"
                disabled={actionLoading}
              >
                Mark as Completed
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn-danger"
              disabled={actionLoading}
            >
              Delete Ticket
            </button>
          </div>
        )}
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Complete Ticket</h2>
            <p>Are you sure you want to mark this ticket as completed?</p>
            <div className="modal-actions">
              <button 
                onClick={handleComplete} 
                className="btn-success" 
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Yes, Complete'}
              </button>
              <button 
                onClick={() => setShowCompleteModal(false)} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminTicketDetail;