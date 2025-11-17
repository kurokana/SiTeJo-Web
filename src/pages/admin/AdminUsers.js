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
            setError(error.response?.data?.message || 'Failed to load users');
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
            setError('Password must be at least 8 characters');
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
                alert('User created successfully');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(' ')
                : error.response?.data?.message || 'Failed to create user';
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
                alert('User updated successfully');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(' ')
                : error.response?.data?.message || 'Failed to update user';
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
                alert('User deleted successfully');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete user';
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
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="admin-users-container">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p className="subtitle">Manage all users in the system</p>
                </div>
                <button className="btn-create" onClick={handleCreate}>
                    ➕ Create New User
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>NPM/NIP</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
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
                                            Edit
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="empty-state">
                        <p>No users found</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEdit}>
                            <div className="form-group">
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
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
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
                                <label htmlFor="password">New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
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
                            <h2>Create New User</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCreate}>
                            <div className="form-group">
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
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
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
                                    Students (mahasiswa) must register through the public registration form
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    placeholder="Minimum 8 characters"
                                />
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Create User
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
                            <h2>Confirm Delete</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
                            <p className="warning-text">This action cannot be undone.</p>
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn-delete"
                                onClick={handleConfirmDelete}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
