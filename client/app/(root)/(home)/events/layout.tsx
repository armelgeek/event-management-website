import React from 'react';
interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function BaseLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <main className="max-w-screen-2xl lg:px-52 xl:px-52 min-h-screen">
        {children}
      </main>
    </div>
  );
}
