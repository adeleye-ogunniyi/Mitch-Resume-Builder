import React from 'react';
import Header from '../components/Header';
import ResumeBuilder from '../components/ResumeBuilder';

const Builder = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ResumeBuilder />
      </main>
    </>
  );
};

export default Builder;