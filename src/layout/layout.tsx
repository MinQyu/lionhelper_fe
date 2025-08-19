import Sidebar from './sidebar';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}
