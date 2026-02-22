// pages/admin/users.js
// 查看注册用户列表

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || 'Failed to load users');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <>
      <Head>
        <title>Users - BriefingDeck Admin</title>
      </Head>
      <div className="min-h-screen bg-cream-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">
            Registered Users ({users.length})
          </h1>
          <p className="text-charcoal-500 mb-6">
            Total users who have signed up with Google
          </p>

          <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-sand-50 border-b border-sand-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-charcoal-700">User</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-charcoal-700">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-charcoal-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-sand-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-sm">
                            {user.name?.[0] || '?'}
                          </div>
                        )}
                        <span className="font-medium text-charcoal-900">{user.name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-charcoal-500">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
