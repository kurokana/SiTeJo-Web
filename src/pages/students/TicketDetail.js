import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { documentService } from '../../services/documentService';
import '../../styles/TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTicketDetail();
  }, [id]);

  const loadTicketDetail = async () => {
    try {
      const [ticketResponse, documentsResponse] = await Promise.all([
        ticketService.getTicketById(id),
        documentService.getDocumentsByTicket(id)
      ]);

      setTicket(ticketResponse.data);
      setDocuments(documentsResponse.data);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      await documentService.uploadDocument(id, file, 'supporting_document');
      await loadTicketDetail(); // Reload to show new file
      alert('File uploaded successfully!');
    } catch (err) {
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
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
    } catch (err) {
      alert('Failed to download file');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentService.deleteDocument(documentId);
      await loadTicketDetail();
      alert('Document deleted successfully!');
    } catch (err) {
      alert('Failed to delete document');
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  const canEdit = ticket.status === 'pending' || ticket.status === 'rejected';

  return (
    <div className="ticket-detail-container">
      <div className="detail-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="ticket-number">Ticket #{ticket.ticket_number}</p>
        </div>
        <div className="header-actions">
          {canEdit && (
            <Link to={`/student/tickets/${id}/edit`} className="btn-secondary">
              Edit Ticket
            </Link>
          )}
          <Link to="/student/tickets" className="btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
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
              <label>Created At</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>

            <div className="info-item">
              <label>Lecturer</label>
              <span>{ticket.lecturer?.name}</span>
            </div>

            {ticket.reviewed_at && (
              <div className="info-item">
                <label>Reviewed At</label>
                <span>{new Date(ticket.reviewed_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Description</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {ticket.lecturer_notes && (
          <div className="detail-section alert-info">
            <h3>Lecturer Notes</h3>
            <p>{ticket.lecturer_notes}</p>
          </div>
        )}

        {ticket.rejection_reason && (
          <div className="detail-section alert-danger">
            <h3>Rejection Reason</h3>
            <p>{ticket.rejection_reason}</p>
          </div>
        )}

        {ticket.admin_notes && (
          <div className="detail-section alert-info">
            <h3>Admin Notes</h3>
            <p>{ticket.admin_notes}</p>
          </div>
        )}

        <div className="detail-section">
          <div className="section-header">
            <h3>Documents</h3>
            {canEdit && (
              <label className="btn-primary file-upload-btn">
                {uploadingFile ? 'Uploading...' : 'Upload Document'}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
            )}
          </div>

          {documents.length === 0 ? (
            <p className="empty-message">No documents uploaded yet</p>
          ) : (
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <span className="document-name">{doc.file_name}</span>
                    <span className="document-meta">
                      {doc.document_type.replace('_', ' ')} • 
                      {(doc.file_size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="document-actions">
                    <button
                      onClick={() => handleDownload(doc.id, doc.file_name)}
                      className="btn-link"
                    >
                      Download
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="btn-danger-link"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;