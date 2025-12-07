import React, {useState, useEffect} from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import { documentService } from "../../services/documentService";
import '../../style/CreateTicket.css';

const EditTicket = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [lecturer, setLecturer] = useState([]);
    const [formData, setFormData] = useState({
        lecturer_id: '',
        title: '',
        description : '',
        type : 'surat_rekomendasi',
        priority : 'medium',
    });
    const [files, setFiles] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadTicketData = async () => {
        try {
            const [ticketResponse, documentsResponse] = await Promise.all([
                ticketService.getTicketById(id),
                documentService.getDocumentsByTicket(id)
            ]);

            let ticketData = ticketResponse.data;
            if (ticketData && ticketData.data) {
                ticketData = ticketData.data;
            }

            // Check if ticket can be edited (only pending or rejected)
            if (!['pending', 'rejected'].includes(ticketData.status)) {
                setError('Tiket hanya bisa diedit jika statusnya Menunggu atau Ditolak');
                setTimeout(() => {
                    navigate(`/student/tickets/${id}`);
                }, 2000);
                return;
            }

            setFormData({
                lecturer_id: ticketData.lecturer_id || '',
                title: ticketData.title || '',
                description: ticketData.description || '',
                type: ticketData.type || 'surat_rekomendasi',
                priority: ticketData.priority || 'medium',
            });

            const docs = documentsResponse.data.data || documentsResponse.data || [];
            setExistingDocuments(Array.isArray(docs) ? docs : []);
            
        } catch (error) {
            setError('Gagal memuat data tiket. Silakan coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    const loadLecturers = async () => {
        try {
            const response = await ticketService.getLecturers();
            const lecturersData = response.data.data || response.data || [];
            setLecturer(Array.isArray(lecturersData) ? lecturersData : []);
        } catch (error) {
            // Silently fail
        }
    };

    useEffect(() => {
        loadTicketData();
        loadLecturers();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

        try {
            await documentService.deleteDocument(documentId);
            setExistingDocuments(existingDocuments.filter(doc => doc.id !== documentId));
            alert('Dokumen berhasil dihapus!');
        } catch (err) {
            alert('Gagal menghapus dokumen');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            console.log('Updating ticket with data:', formData);
            await ticketService.updateTicket(id, formData);
            
            console.log('Files to upload:', files);
            if (files.length > 0) {
                for (const file of files) {
                    console.log('Uploading file:', file.name);
                    await documentService.uploadDocument(id, file, 'attachment');
                }
                console.log('All files uploaded successfully');
            }

            setSuccess('Tiket berhasil diperbarui!');
            setTimeout(() => {
                navigate('/student/tickets');
            }, 2000);

        } catch (error) {
            console.error('Error updating ticket:', error);
            setError(error.response?.data?.message || 'Gagal memperbarui tiket. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Memuat...</div>;
    }

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Edit Tiket</h1>
                <Link to={`/student/tickets/${id}`} className="btn-secondary">Kembali</Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="lecturer_id">Pilih Dosen</label>
                    <select
                        id="lecturer_id"
                        name="lecturer_id"
                        value={formData.lecturer_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Pilih Dosen --</option>
                        {lecturer.map(lect => (
                            <option key={lect.id} value={lect.id}>
                                {lect.name} - {lect.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="title">Judul Tiket</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Masukkan judul tiket"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Jenis Tiket</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="surat_rekomendasi">Surat Rekomendasi</option>
                        <option value="surat_keterangan">Surat Keterangan</option>
                        <option value="ijin">Izin</option>
                        <option value="lainnya">Lainnya</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Prioritas</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="low">Rendah</option>
                        <option value="medium">Sedang</option>
                        <option value="high">Tinggi</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Deskripsi</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Jelaskan permintaan Anda"
                        required
                        rows="6"
                    />
                </div>

                {/* Existing Documents */}
                {existingDocuments.length > 0 && (
                    <div className="form-group">
                        <label>Dokumen yang Sudah Ada</label>
                        <div className="existing-documents">
                            {existingDocuments.map((doc) => (
                                <div key={doc.id} className="document-item">
                                    <span>📄 {doc.file_name}</span>
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="btn-danger-small"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="files">Tambah Dokumen Baru (Opsional - PDF)</label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        onChange={handleChange}
                        multiple
                        accept=".pdf"
                    />
                    <small className="form-text">
                        Anda dapat mengunggah beberapa file PDF.
                    </small>
                    {files.length > 0 && (
                        <div className="file-list">
                            <p>File baru dipilih</p>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="form-action">
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={submitting}
                    >
                        {submitting ? 'Memperbarui Tiket...' : 'Perbarui Tiket'}
                    </button>
                    <Link to={`/student/tickets/${id}`} className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditTicket;
