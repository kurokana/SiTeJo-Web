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
        type : 'surat-rekomendasi',
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
            setLecturer(response.data);
        } catch (error) {
            setError('Failed to load lecturers. Please try again later.');
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
            const ticketId = response.data.id;

            if (files.length > 0) {
                for (const file of files) {
                    await documentService.uploadDocument(ticketId, file, 'supporting_document');
                }
            }

            setSuccess('Ticket created successfully!');
            setTimeout(() => {
                navigate('/student/tickets');
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Create New Ticket</h1>
                <Link to="/student/tickets" className="btn-secondary">Back to Tickets</Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="lecturer_id">Select Lecturer</label>
                    <select
                        id="lecturer_id"
                        name="lecturer_id"
                        value={formData.lecturer_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Lecturer --</option>
                        {lecturer.map(lecturer => (
                            <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.name} - {lecturer.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="surat-rekomendasi">Surat Rekomendasi</option>
                        <option value="surat-keterangan">Surat Keterangan</option>
                        <option value="izin-penelitian">Izin</option>
                        <option value="lainnya">Lainnya</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your request"
                        required
                        rows="6"
                        />
                </div>  

                <div className="form-group">
                    <label htmlFor="files">Upload Supporting Documents</label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        onChange={handleChange}
                        multiple
                        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                    />
                    <small className="form-text">
                        You can upload multiple files. Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG.
                    </small>
                    {files.length > 0 && (
                        <div className="file-list">
                            <p> select files</p>
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
                        {loading ? 'Creating Ticket...' : 'Create Ticket'}
                    </button>
                    <Link to="/student/tickets" className="btn-secondary">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};
export default CreateTicket;
                    