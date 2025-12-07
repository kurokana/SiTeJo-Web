import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { documentService } from '../../services/documentService';
import '../../style/TicketsDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState('');

  const loadTicketDetail = async () => {
    try {
      const [ticketResponse, documentsResponse] = await Promise.all([
        ticketService.getTicketById(id),
        documentService.getDocumentsByTicket(id)
      ]);
      
      let ticketData = ticketResponse.data;
      if (ticketData && ticketData.data) {
        ticketData = ticketData.data;
      }
      
      setTicket(ticketData);
      
      const docs = documentsResponse.data.data || documentsResponse.data || [];
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err) {
      setError('Gagal memuat detail tiket');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketDetail();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      await documentService.uploadDocument(id, file, 'attachment');
      await loadTicketDetail();
      alert('File berhasil diunggah!');
    } catch (err) {
      alert(`Gagal mengunggah file: ${err.response?.data?.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploadingFile(false);
      // Reset file input
      e.target.value = '';
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
      alert('Gagal mengunduh file');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

    try {
      await documentService.deleteDocument(documentId);
      await loadTicketDetail();
      alert('Dokumen berhasil dihapus!');
    } catch (err) {
      alert('Gagal menghapus dokumen');
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

  const getWorkflowSteps = () => {
    const steps = [
      { key: 'pending', label: 'Tiket Dibuat' },
      { key: 'in_review', label: 'Sedang Ditinjau' },
      { key: 'approved', label: 'Disetujui' },
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

  if (loading) return <div className="loading">Memuat...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!ticket) return <div>Tiket tidak ditemukan</div>;

  const canEdit = ticket.status === 'pending' || ticket.status === 'rejected';

  return (
    <div className="ticket-detail-container">
      <div className="detail-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="ticket-number">Tiket #{ticket.ticket_number}</p>
        </div>
        <div className="header-actions">
          {canEdit && (
            <Link to={`/student/tickets/${id}/edit`} className="btn-secondary">
              Ubah Tiket
            </Link>
          )}
          <Link to="/student/tickets" className="btn-secondary">
            Kembali
          </Link>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="workflow-progress">
        <h3>Status Tiket Anda</h3>
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
        {/* Rejection Alert */}
        {ticket.status === 'rejected' && (
          <div className="alert-box alert-danger">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h4>Tiket Ditolak</h4>
              <p>Tiket Anda telah ditolak. Silakan revisi tiket berdasarkan alasan penolakan di bawah, lalu klik tombol "Ubah Tiket" untuk mengirim ulang.</p>
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>Informasi Tiket</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className={`badge ${getStatusBadge(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {ticket.nomor_surat && (
              <div className="info-item">
                <label>Nomor Surat</label>
                <span style={{ fontWeight: '600', color: '#0066CC' }}>{ticket.nomor_surat}</span>
              </div>
            )}

            <div className="info-item">
              <label>Prioritas</label>
              <span className="badge">{ticket.priority.toUpperCase()}</span>
            </div>

            <div className="info-item">
              <label>Jenis</label>
              <span>{ticket.type.replace('_', ' ')}</span>
            </div>

            <div className="info-item">
              <label>Dibuat</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>

            <div className="info-item">
              <label>Dosen</label>
              <span>{ticket.lecturer?.name}</span>
            </div>

            {ticket.reviewed_at && (
              <div className="info-item">
                <label>Ditinjau Pada</label>
                <span>{new Date(ticket.reviewed_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Deskripsi</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {ticket.lecturer_notes && (
          <div className="detail-section notes-section lecturer-notes">
            <div className="notes-header">
              <h3>📝 Catatan Dosen</h3>
            </div>
            <p className="notes-text">{ticket.lecturer_notes}</p>
          </div>
        )}

        {ticket.rejection_reason && (
          <div className="detail-section notes-section rejection-notes">
            <div className="notes-header">
              <h3>❌ Alasan Penolakan</h3>
            </div>
            <p className="notes-text">{ticket.rejection_reason}</p>
            {canEdit && (
              <Link to={`/student/tickets/${id}/edit`} className="btn-primary" style={{marginTop: '16px', display: 'inline-block'}}>
                📝 Revisi Tiket Sekarang
              </Link>
            )}
          </div>
        )}

        {ticket.admin_notes && (
          <div className="detail-section alert-info">
            <h3>Catatan Admin</h3>
            <p>{ticket.admin_notes}</p>
          </div>
        )}

        <div className="detail-section">
          <div className="section-header">
            <h3>Dokumen</h3>
            {canEdit && (
              <label className="btn-primary file-upload-btn">
                {uploadingFile ? 'Mengunggah...' : 'Unggah Dokumen'}
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
            <p className="empty-message">Belum ada dokumen yang diunggah</p>
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
                      Unduh
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="btn-danger-link"
                      >
                        Hapus
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