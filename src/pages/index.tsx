import React from 'react';
import Link from 'next/link';

const Index: React.FC = () => (
  <>
    <Link href="/about">About</Link>
    <p className="p-5 text-3xl text-red-400 bg-gray-100">Hi this is a test</p>
  </>
);

export default Index;
