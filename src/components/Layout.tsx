export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      style={{ margin: "0 auto" }}
      className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-2xl font-mono prose lg:prose-xl shadow-card"
    >
      {children}
    </main>
  );
}
