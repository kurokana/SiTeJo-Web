import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import '../../style/Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState ({
        name: '',
        email: '',
        password: '',
        password_confirmation: '', 
        npm: '',
        phone: '', 
        role: 'mahasiswa'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Map npm to nim_nip for backend compatibility
            const submitData = {
                ...formData,
                nim_nip: formData.npm
            };
            delete submitData.npm;

            await register(submitData);
            
            // Redirect to login page after successful registration
            alert('Registration successful! Please login with your credentials.');
            navigate('/login');
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "auth-container">
            <div className="auth-card">
                <h1>Register</h1>
                <p className="auth-subtitle">Create your account.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <div className="auth-form-group">
                        <label htmlFor="npm">NPM</label>
                        <input
                            type="text"
                            id="npm"
                            name="npm"
                            value={formData.npm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;