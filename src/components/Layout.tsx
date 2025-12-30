export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      style={{ margin: "0 auto" }}
      className="bg-white/80 shadow-card backdrop-blur-md p-6 border border-white/20 rounded-2xl w-full max-w-full 2xl:max-w-360 sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl font-mono"
    >
      {children}
    </main>
  );
}
