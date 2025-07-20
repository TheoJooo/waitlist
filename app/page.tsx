import WaitlistForm from '@/components/WaitlistForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold mb-6">Rejoins la liste d’attente</h1>
      <WaitlistForm />
    </main>
  );
}