import React, {use, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import '../../style/Auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState ({
        email: '',
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
                <h1>Masuk</h1>
                <p className="auth-subtitle">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
                
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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

                <p className="auth-footer">
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;