import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../../services/authService';
import '../../style/AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nim_nip: '',
        role: 'mahasiswa',
        phone: '',
        password: ''
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const token = authService.getToken();
            const response = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Gagal memuat pengguna');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            nim_nip: user.nim_nip || '',
            role: user.role,
            phone: user.phone || '',
            password: ''
        });
        setShowEditModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleCreate = () => {
        setFormData({
            name: '',
            email: '',
            nim_nip: '',
            role: 'dosen',
            phone: '',
            password: ''
        });
        setShowCreateModal(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.password || formData.password.length < 8) {
            setError('Kata sandi minimal 8 karakter');
            return;
        }

        try {
            const token = authService.getToken();
            const createData = {
                ...formData,
                password_confirmation: formData.password
            };

            const response = await axios.post(
                `${API_URL}/users`,
                createData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setShowCreateModal(false);
                loadUsers();
                alert('Pengguna berhasil dibuat');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(' ')
                : error.response?.data?.message || 'Gagal membuat pengguna';
            setError(errorMsg);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = authService.getToken();
            const updateData = { ...formData };
            
            // Remove password if empty
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await axios.put(
                `${API_URL}/users/${selectedUser.id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setShowEditModal(false);
                loadUsers();
                alert('Pengguna berhasil diperbarui');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(' ')
                : error.response?.data?.message || 'Gagal memperbarui pengguna';
            setError(errorMsg);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const token = authService.getToken();
            const response = await axios.delete(
                `${API_URL}/users/${selectedUser.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setShowDeleteModal(false);
                loadUsers();
                alert('Pengguna berhasil dihapus');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Gagal menghapus pengguna';
            alert(errorMsg);
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            mahasiswa: 'badge-student',
            dosen: 'badge-lecturer',
            admin: 'badge-admin'
        };
        return badges[role] || 'badge-default';
    };

    if (loading) {
        return <div className="loading">Memuat pengguna...</div>;
    }

    return (
        <div className="admin-users-container">
            <div className="page-header">
                <div>
                    <h1>Manajemen Pengguna</h1>
                    <p className="subtitle">Kelola semua pengguna dalam sistem</p>
                </div>
                <button className="btn-create" onClick={handleCreate}>
                    ➕ Buat Pengguna Baru
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>NPM/NIP</th>
                            <th>Telepon</th>
                            <th>Peran</th>
                            <th>Bergabung</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.nim_nip || '-'}</td>
                                <td>{user.phone || '-'}</td>
                                <td>
                                    <span className={`badge ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-edit"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Ubah
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="empty-state">
                        <p>Tidak ada pengguna</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ubah Pengguna</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEdit}>
                            <div className="form-group">
                                <label htmlFor="name">Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
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
                                <label htmlFor="nim_nip">NPM/NIP</label>
                                <input
                                    type="text"
                                    id="nim_nip"
                                    name="nim_nip"
                                    value={formData.nim_nip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Telepon</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Peran</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="dosen">Dosen</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Kata Sandi Baru (kosongkan untuk mempertahankan yang lama)</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    placeholder="Kosongkan untuk mempertahankan kata sandi lama"
                                />
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="btn-save">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Buat Pengguna Baru</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCreate}>
                            <div className="form-group">
                                <label htmlFor="name">Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
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
                                <label htmlFor="nim_nip">NPM/NIP</label>
                                <input
                                    type="text"
                                    id="nim_nip"
                                    name="nim_nip"
                                    value={formData.nim_nip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Telepon</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Peran</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="dosen">Dosen</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <small style={{color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                                    Mahasiswa harus mendaftar melalui formulir pendaftaran publik
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Kata Sandi Baru</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    placeholder="Minimal 8 karakter"
                                />
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="btn-save">
                                    Buat Pengguna
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Konfirmasi Hapus</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.name}</strong>?</p>
                            <p className="warning-text">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button 
                                type="button" 
                                className="btn-delete"
                                onClick={handleConfirmDelete}
                            >
                                Hapus Pengguna
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
