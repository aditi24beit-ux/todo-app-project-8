import { useEffect, useState, useMemo } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { demoAdminService } from '../../services/demo/demoAdminService';
import type { User } from '../../types';
import './ManageUsers.css';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Invite user modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user');
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await demoAdminService.getAllUsers();
        setUsers(data);
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
      result = result.filter((u) => u.status === statusFilter);
    }

    return result;
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: User) => {
    try {
      const updated = await demoAdminService.toggleUserStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to update user status.');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.name}"?`)) return;
    try {
      await demoAdminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete user.');
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    try {
      const newUser = await demoAdminService.createUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
      });
      setUsers((prev) => [newUser, ...prev]);
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('user');
    } catch (err: unknown) {
      setInviteError((err as Error).message || 'Failed to invite user.');
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
              + Invite user
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
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              className="users-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                            : 'Oct 28, 2026'}
                        </span>
                      </td>

                      {/* Status Cell */}
                      <td>
                        <button
                          type="button"
                          className={`btn-toggle-status ${u.status === 'active' ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(u)}
                          title="Click to toggle active/inactive"
                        >
                          <span className="status-indicator-dot" />
                          <span>{u.status === 'active' ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="users-actions-group">
                          <button
                            type="button"
                            className="btn-user-action"
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === 'active' ? 'Deactivate user' : 'Activate user'}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="btn-user-action btn-delete-action"
                            onClick={() => handleDeleteUser(u)}
                            title="Remove user"
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

        {/* Invite User Modal */}
        {isInviteModalOpen && (
          <div className="modal-overlay" onClick={() => setIsInviteModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Invite Workspace User</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  ×
                </button>
              </div>

              {inviteError && (
                <div className="invite-error-alert">{inviteError}</div>
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
                  <label htmlFor="invite-role">Assigned role</label>
                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'user' | 'admin')}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="modal-action-bar">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsInviteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save">
                    Create User
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
