export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      style={{ margin: "0 auto" }}
      className="bg-white p-6 rounded-2xl font-mono prose lg:prose-xl"
    >
      {children}
    </main>
  );
}
