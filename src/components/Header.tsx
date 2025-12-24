export default function BlogHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="p-4 w-full tracking-widest">{children}</div>;
}
