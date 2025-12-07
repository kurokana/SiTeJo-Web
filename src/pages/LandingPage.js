import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo">
            <img src="/unila-logo.png" alt="Universitas Lampung" className="unila-logo" />
            <div className="header-text">
              <h1>Universitas Lampung</h1>
              <p>Jurusan Teknik Elektro</p>
            </div>
          </div>
          <button className="btn-login" onClick={() => navigate('/login')}>
            Masuk ke Sistem
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Sistem Informasi Ticketing<br />
              Persetujuan Tanda Tangan
            </h1>
            <p className="hero-subtitle">
              Sistem terintegrasi untuk pengajuan dan persetujuan surat yang memerlukan 
              tanda tangan dosen di Jurusan Teknik Elektro Universitas Lampung
            </p>
            <div className="hero-actions">
              <button className="btn-primary-large" onClick={() => navigate('/login')}>
                Akses Sistem
              </button>
              <button className="btn-secondary-large" onClick={() => navigate('/verify-letter')}>
                Verifikasi Nomor Surat
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="feature-card-hero">
              <div className="feature-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Proses Digital</h3>
              <p>Pengajuan surat secara online, cepat dan efisien</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Fitur Sistem</h2>
            <p>Solusi lengkap untuk manajemen surat dan persetujuan tanda tangan</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Untuk Mahasiswa</h3>
              <p>Ajukan permohonan surat dengan mudah, upload dokumen pendukung, dan pantau status pengajuan secara real-time</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Untuk Dosen</h3>
              <p>Review dan setujui pengajuan mahasiswa, berikan catatan dan feedback, serta kelola persetujuan dengan efisien</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </div>
              <h3>Untuk Administrator</h3>
              <p>Kelola pengguna sistem, monitoring seluruh proses pengajuan, dan pastikan workflow berjalan lancar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="process-container">
          <div className="section-header">
            <h2>Alur Proses Pengajuan</h2>
            <p>Sistem yang terstruktur dan transparan</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Pengajuan</h3>
              <p>Mahasiswa mengajukan permohonan surat melalui sistem dengan melengkapi data dan dokumen pendukung</p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Verifikasi Admin</h3>
              <p>Administrator memverifikasi kelengkapan dokumen dan meneruskan ke dosen yang bersangkutan</p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Persetujuan Dosen</h3>
              <p>Dosen mereview pengajuan dan memberikan persetujuan atau catatan perbaikan</p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Selesai</h3>
              <p>Dokumen selesai diproses dan dapat diunduh oleh mahasiswa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>100%</h3>
            <p>Digital</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Akses Sistem</p>
          </div>
          <div className="stat-item">
            <h3>Real-time</h3>
            <p>Status Tracking</p>
          </div>
          <div className="stat-item">
            <h3>Aman</h3>
            <p>SSO Authentication</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Mulai Gunakan Sistem Sekarang</h2>
          <p>Login menggunakan akun SSO Universitas Lampung Anda</p>
          <button className="btn-cta" onClick={() => navigate('/login')}>
            Login ke Sistem
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Sistem Informasi Ticketing</h4>
              <p>Jurusan Teknik Elektro</p>
              <p>Universitas Lampung</p>
            </div>
            <div className="footer-section">
              <h4>Kontak</h4>
              <p>Email: elektro@unila.ac.id</p>
              <p>Telp: (0721) 123456</p>
            </div>
            <div className="footer-section">
              <h4>Alamat</h4>
              <p>Gedung H Fakultas Teknik</p>
              <p>Universitas Lampung</p>
              <p>Bandar Lampung</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Jurusan Teknik Elektro Universitas Lampung. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
