'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchQuestions } from '../../services/api';

const Learner = () => {
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes = 300 seconds
  const router = useRouter();

  useEffect(() => {
    const fetchMcqs = async () => {
      const data = await fetchQuestions();
      setMcqs(data);
    };

    fetchMcqs();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, optionId: string, isChecked: boolean) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [optionId]: isChecked,
      },
    }));
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    mcqs.forEach((mcq) => {
      const correctOptions = mcq.options.filter((option: any) => option.isCorrect).map((option: any) => option.id);
      const selectedOptions = answers[mcq.id] ? Object.keys(answers[mcq.id]).filter((optionId) => answers[mcq.id][optionId]) : [];

      if (JSON.stringify(correctOptions.sort()) === JSON.stringify(selectedOptions.sort())) {
        calculatedScore += 1;
      }
    });

    return calculatedScore;
  };

  const handleTimeout = () => {
    const calculatedScore = calculateScore();
    router.push(`/result?score=${calculatedScore}&total=${mcqs.length}&timeout=true`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const calculatedScore = calculateScore();
    router.push(`/result?score=${calculatedScore}&total=${mcqs.length}&timeout=false`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available MCQs</h1>
      <div className="text-right mb-4 text-red-500 font-bold">Time Left: {formatTime(timeLeft)}</div>
      <form onSubmit={handleSubmit}>
        {mcqs.map((mcq, index) => (
          <div key={index} className="border p-4 mb-4">
            <h2 className="text-lg font-semibold">Question {index + 1}</h2>
            <div dangerouslySetInnerHTML={{ __html: mcq.question }} />
            {mcq.image && (
              <div className="relative w-full h-64 mt-4">
                <Image src={mcq.image} alt="Question Image" layout="fill" objectFit="contain" />
              </div>
            )}
            {mcq.options.map((option: any) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  id={`option-${index}-${option.id}`}
                  onChange={(e) => handleAnswerChange(mcq.id, option.id, e.target.checked)}
                />
                <label htmlFor={`option-${index}-${option.id}`}>{option.text}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {score !== null && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Your Score: {score} / {mcqs.length}</h2>
        </div>
      )}
    </div>
  );
};

export default Learner;
