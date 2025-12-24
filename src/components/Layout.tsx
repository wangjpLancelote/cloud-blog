export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main style={{ margin: "0 auto" }} className="font-mono prose lg:prose-xl">
      {children}
    </main>
  );
}
