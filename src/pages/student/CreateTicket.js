import React, {useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import { documentService } from "../../services/documentService";
import '../../style/CreateTicket.css';

const CreateTicket = () => {
    const navigate = useNavigate();
    const [lecturer, setLecturer] = useState([]);
    const [formData, setFormData] = useState({
        lecturer_id: '',
        title: '',
        description : '',
        type : 'surat_rekomendasi',
        priority : 'medium',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadLecturers();
    }, []);

    const loadLecturers = async () => {
        try {
            const response = await ticketService.getLecturers();
            const lecturersData = response.data.data || response.data || [];
            setLecturer(Array.isArray(lecturersData) ? lecturersData : []);
        } catch (error) {
            console.error('Failed to load lecturers:', error);
            setError('Gagal memuat dosen. Silakan coba lagi nanti.');
            setLecturer([]);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await ticketService.createTicket(formData);
            // Handle nested response structure: response.data.data contains the ticket
            const ticket = response.data.data || response.data;
            const ticketId = ticket.id;

            if (files.length > 0) {
                for (const file of files) {
                    await documentService.uploadDocument(ticketId, file, 'supporting_document');
                }
            }

            setSuccess('Tiket berhasil dibuat!');
            setTimeout(() => {
                navigate('/student/tickets');
            }, 2000);

        } catch (error) {
            setError(error.message || 'Gagal membuat tiket. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Buat Tiket Baru</h1>
                <Link to="/student/tickets" className="btn-secondary">Kembali</Link>
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
                        {lecturer.map(lecturer => (
                            <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.name} - {lecturer.email}
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

                <div className="form-group">
                    <label htmlFor="files">Lampirkan Dokumen</label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        onChange={handleChange}
                        multiple
                        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                    />
                    <small className="form-text">
                        Anda dapat mengunggah beberapa file. Format yang diterima: PDF, DOC, DOCX, JPG, JPEG, PNG.
                    </small>
                    {files.length > 0 && (
                        <div className="file-list">
                            <p>File dipilih</p>
                            <ul>
                                {/* eslint-disable-next-line */}
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
                    disabled={loading}
                    >
                        {loading ? 'Membuat Tiket...' : 'Kirim Tiket'}
                    </button>
                    <Link to="/student/tickets" className="btn-secondary">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};
export default CreateTicket;
                    