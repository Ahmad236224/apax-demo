export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-apax-bg px-6 py-10">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}
