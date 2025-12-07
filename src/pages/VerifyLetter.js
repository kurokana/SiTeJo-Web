import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/VerifyLetter.css';

const VerifyLetter = () => {
    const [nomorSurat, setNomorSurat] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.get(`http://localhost:8000/api/verify-letter/${encodeURIComponent(nomorSurat)}`);
            setResult(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memverifikasi nomor surat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-header">
                    <img src="/unila-logo.png" alt="Unila" className="verify-logo" />
                    <h1>Verifikasi Nomor Surat</h1>
                    <p className="verify-subtitle">Sistem Ticketing Jurusan Teknik Elektro</p>
                </div>

                <form onSubmit={handleVerify} className="verify-form">
                    <div className="form-group">
                        <label htmlFor="nomorSurat">Nomor Surat</label>
                        <input
                            type="text"
                            id="nomorSurat"
                            value={nomorSurat}
                            onChange={(e) => setNomorSurat(e.target.value)}
                            placeholder="Contoh: 001/TE-UNILA/SKP/XII/2025/ABC123"
                            required
                        />
                        <small className="form-help">
                            Masukkan nomor surat lengkap yang tertera pada dokumen
                        </small>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Memverifikasi...' : 'Verifikasi'}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-error">
                        <strong>❌ Tidak Valid</strong>
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="verify-result">
                        <div className="alert alert-success">
                            <strong>✅ Surat Valid</strong>
                            <p>Nomor surat ditemukan dalam sistem dan telah terverifikasi</p>
                        </div>

                        <div className="result-details">
                            <h3>Detail Surat</h3>
                            
                            <div className="detail-item">
                                <label>Nomor Surat:</label>
                                <span className="nomor-surat">{result.nomor_surat}</span>
                            </div>

                            <div className="detail-item">
                                <label>Judul:</label>
                                <span>{result.ticket.title}</span>
                            </div>

                            <div className="detail-item">
                                <label>Jenis:</label>
                                <span>{result.info.category_name}</span>
                            </div>

                            <div className="detail-item">
                                <label>Mahasiswa:</label>
                                <span>{result.ticket.student.name} ({result.ticket.student.nim_nip})</span>
                            </div>

                            <div className="detail-item">
                                <label>Dosen Penandatangan:</label>
                                <span>{result.ticket.lecturer.name}</span>
                            </div>

                            <div className="detail-item">
                                <label>Tanggal Persetujuan:</label>
                                <span>{new Date(result.ticket.approved_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                            </div>

                            <div className="detail-item">
                                <label>Status:</label>
                                <span className="badge badge-success">{result.ticket.status.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="result-info">
                            <h4>Informasi Nomor Surat</h4>
                            <ul>
                                <li><strong>Nomor Urut:</strong> {result.info.sequential_number}</li>
                                <li><strong>Institusi:</strong> {result.info.institution} (Teknik Elektro - Universitas Lampung)</li>
                                <li><strong>Kategori:</strong> {result.info.category_code} - {result.info.category_name}</li>
                                <li><strong>Bulan:</strong> {result.info.month} (Bulan Romawi)</li>
                                <li><strong>Tahun:</strong> {result.info.year}</li>
                                <li><strong>Kode Unik:</strong> {result.info.unique_code}</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="verify-footer">
                    <button onClick={() => navigate('/login')} className="btn-secondary">
                        Kembali ke Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyLetter;
