export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }} className='font-mono prose lg:prose-xl'>
        {children}
      </main>
    );
  }
  