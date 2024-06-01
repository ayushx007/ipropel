'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Result = () => {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const total = searchParams.get('total');
  const timeout = searchParams.get('timeout');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (timeout === 'true') {
      setMessage('Your timer expired, but your answers were saved.');
    } else {
      setMessage('You have submitted the quiz.');
    }
  }, [timeout]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
      <p className="mb-4">{message}</p>
      <h2 className="text-xl">Your Score: {score} / {total}</h2>
    </div>
  );
};

export default Result;
