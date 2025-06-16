import { useState } from 'react';
import { auth, db, setDoc, doc } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), { role });
      router.push('/dashboard');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <input type="email" placeholder="Email" className="mb-2 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="mb-2 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
      <select className="mb-4 p-2 border rounded" value={role} onChange={e => setRole(e.target.value)}>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button onClick={handleSignup} className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
    </div>
  );
}
