import useFetch from './hooks/useFetch';

// Shape of each user from the API
interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserList() {
  // data is inferred as User[] | null — no cast needed
  const { data, loading, error } = useFetch<User[]>(
    'https://jsonplaceholder.typicode.com/users'
  );

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  // After the guards above, TypeScript narrows data to User[]
  return (
    <ul>
      {data!.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> — {user.email}
        </li>
      ))}
    </ul>
  );
}
