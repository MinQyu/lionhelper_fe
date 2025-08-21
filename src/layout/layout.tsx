import Sidebar from '@/layout/Sidebar';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background px-8 lg:px-32">{children}</main>
    </div>
  );
}
