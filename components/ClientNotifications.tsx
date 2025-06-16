import { useEffect, useState } from 'react';
import { db, collection, query, onSnapshot } from '../firebase';

export function ClientNotifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(n => n.userId === user.uid);
      setNotifications(list);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map(n => (
          <li key={n.id} className="bg-blue-50 border px-4 py-2 rounded text-sm shadow">
            📢 {n.message} <span className="text-gray-500 ml-2">({new Date(n.createdAt).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}