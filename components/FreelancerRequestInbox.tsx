import { useEffect, useState } from 'react';
import { db, collection, query, onSnapshot, updateDoc, doc, addDoc, getDoc } from '../firebase';

export function FreelancerRequestInbox({ user }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'bookingRequests'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(list.filter(r => r.freelancerId === user.uid));
    });
    return () => unsub();
  }, [user]);

  const handleResponse = async (id, status, clientId) => {
    await updateDoc(doc(db, 'bookingRequests', id), { status });

    if (status === 'accepted') {
      const booking = await getDoc(doc(db, 'bookingRequests', id));
      const eventDate = booking.exists() ? booking.data().date : null;
      if (eventDate) {
        const freelancerDoc = doc(db, 'users', user.uid);
        const snap = await getDoc(freelancerDoc);
        const dates = snap.exists() ? snap.data().availabilityDates || [] : [];
        const updated = dates.filter(date => date !== eventDate);
        await updateDoc(freelancerDoc, { availabilityDates: updated });
      }

      await addDoc(collection(db, 'notifications'), {
        userId: clientId,
        message: 'Your booking request was accepted!',
        createdAt: new Date().toISOString(),
        type: 'booking'
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Incoming Booking Requests</h2>
      <ul className="space-y-4">
        {requests.map(req => (
          <li key={req.id} className="p-4 border rounded bg-white shadow">
            <p><strong>Message:</strong> {req.message}</p>
            <p className="text-sm text-gray-600">Event ID: {req.eventId}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleResponse(req.id, 'accepted', req.clientId)} className="bg-green-600 text-white px-4 py-1 rounded">
                Accept
              </button>
              <button onClick={() => handleResponse(req.id, 'declined', req.clientId)} className="bg-red-600 text-white px-4 py-1 rounded">
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}