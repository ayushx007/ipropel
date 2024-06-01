import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResultContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const timeout = searchParams.get('timeout');

  return (
    <div>
      <h1>Quiz Result</h1>
      {timeout === 'true' ? (
        <p>Your timer expired but your answers were saved.</p>
      ) : (
        <p>You have submitted the quiz.</p>
      )}
      <p>Your Score: {score}</p>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
