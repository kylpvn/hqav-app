import { getDoc, doc, db } from '../firebase';

export async function getServerSideProps({ req }) {
  const user = req.cookies.user || null;
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const role = userDoc.exists() ? userDoc.data().role : 'client';

  return { props: { role } };
}

export default function UserDashboard({ role }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Dashboard</h1>
      {role === 'freelancer' && <p>Welcome, Freelancer!</p>}
      {role === 'client' && <p>Welcome, Client!</p>}
      {role === 'admin' && <p>Welcome, Admin!</p>}
    </div>
  );
}