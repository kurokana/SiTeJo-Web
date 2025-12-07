import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import '../../style/Auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState ({
        identifier: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading (true);
        setError('');

        try {
            const response = await login(formData);

            const role = response.data.user.role;
            if (role === 'mahasiswa') {
                navigate('/student/dashboard');
            } else if (role === 'dosen') {
                navigate('/lecturer/dashboard');
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            setError(error.message || 'Login gagal. Silakan periksa kredensial Anda dan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/unila-logo.png" alt="Universitas Lampung" />
                </div>
                <div className="sso-header">
                    <h1>Login SSO</h1>
                    <p className="auth-subtitle">Universitas Lampung</p>
                    <p className="auth-subtitle-small">Sistem Ticketing Jurusan Teknik Elektro</p>
                </div>
                
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label htmlFor="identifier">NPM / Email / Username</label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Masukkan NPM, Email, atau Username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Masukkan kata sandi Anda"
                            required
                            />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Masuk...' : 'Masuk'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="sso-info">Login menggunakan akun SSO Universitas Lampung</p>
                    <p className="sso-help">Mahasiswa: gunakan NPM sebagai username dan password</p>
                    <p className="sso-help">Dosen/Admin: gunakan email dan password yang diberikan</p>
                    <div className="back-to-home">
                        <a href="/">← Kembali ke Beranda</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;