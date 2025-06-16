export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }} className='prose lg:prose-xl font-mono'>
        {children}
      </main>
    );
  }
  