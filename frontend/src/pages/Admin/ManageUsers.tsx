import { useEffect, useState, useMemo } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import type { User } from '../../types';
import './ManageUsers.css';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add / Provision user modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load users from backend.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      const wantActive = statusFilter === 'active';
      result = result.filter((u) => u.is_active === wantActive);
    }

    return result;
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: User) => {
    try {
      const updated = await adminService.updateUserStatus(user.id, !user.is_active);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user status.';
      alert(msg);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.name}"? This action cannot be undone.`)) return;
    try {
      await adminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user.';
      alert(msg);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    if (invitePassword.length < 6) {
      setInviteError('Temporary password must be at least 6 characters.');
      return;
    }

    setInviteSubmitting(true);
    try {
      // Backend registers account via /auth/register
      await authService.register({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        password: invitePassword,
      });

      // Refresh real users list from /admin/users
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);

      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register new user.';
      setInviteError(msg);
    } finally {
      setInviteSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Manage Users">
      <div className="manage-users-view">
        <div className="users-page-banner">
          <p className="users-page-subline">
            View and manage accounts in your workspace.
          </p>
        </div>

        {error && <div className="users-error-alert" role="alert">{error}</div>}

        <div className="users-table-card">
          <div className="users-card-header">
            <div className="users-header-left">
              <h3>Registered users</h3>
              <span className="users-count-tag">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </span>
            </div>
            <button
              type="button"
              className="btn-invite-user"
              onClick={() => setIsInviteModalOpen(true)}
            >
              + Add user
            </button>
          </div>

          {/* Controls Bar matching 07-manage-users-desktop.svg */}
          <div className="users-filters-row">
            <div className="users-search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="users-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              className="users-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Users Table matching design */}
          {loading ? (
            <div className="users-loading-box">
              <div className="users-spinner" />
              <span>Loading workspace users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-empty-box">
              <span className="empty-emoji">👥</span>
              <h4>No users found</h4>
              <p>No user accounts match your current filters.</p>
            </div>
          ) : (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>USER</th>
                    <th style={{ width: '15%' }}>ROLE</th>
                    <th style={{ width: '20%' }}>JOINED</th>
                    <th style={{ width: '15%' }}>STATUS</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      {/* User Cell */}
                      <td>
                        <div className="user-profile-cell">
                          <div className="user-circle-avatar">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-text-col">
                            <span className="user-name-cell">{u.name}</span>
                            <span className="user-email-cell">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Cell */}
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>

                      {/* Joined Cell */}
                      <td>
                        <span className="joined-date-cell">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </span>
                      </td>

                      {/* Status Cell */}
                      <td>
                        <button
                          type="button"
                          className={`btn-toggle-status ${u.is_active ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(u)}
                          title="Click to toggle active/inactive"
                        >
                          <span className="status-indicator-dot" />
                          <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="users-actions-group">
                          <button
                            type="button"
                            className="btn-user-action"
                            onClick={() => handleToggleStatus(u)}
                            title={u.is_active ? 'Deactivate user' : 'Activate user'}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="btn-user-action btn-delete-action"
                            onClick={() => handleDeleteUser(u)}
                            title="Remove user"
                            aria-label="Remove user"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {isInviteModalOpen && (
          <div className="modal-overlay" onClick={() => setIsInviteModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create User Account</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setIsInviteModalOpen(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {inviteError && (
                <div className="invite-error-alert" role="alert">{inviteError}</div>
              )}

              <form onSubmit={handleInviteSubmit} className="invite-user-form">
                <div className="form-field-group">
                  <label htmlFor="invite-name">Full name</label>
                  <input
                    id="invite-name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="invite-email">Email address</label>
                  <input
                    id="invite-email"
                    type="email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="invite-password">Temporary password</label>
                  <input
                    id="invite-password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-action-bar">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsInviteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save" disabled={inviteSubmitting}>
                    {inviteSubmitting ? 'Registering...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
