'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchQuestions } from '../../services/api';
import clock from '../../../public/clock.svg';
import checkbox from '../../../public/checkbox.svg';
import checkboxChecked from '../../../public/checkbox_checked.svg';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
  image?: string;
}

export default function Learner() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const [timeLeft, setTimeLeft] = useState<number>(300); 
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId: string, optionId: string, isChecked: boolean) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: {
        ...prevSelectedOptions[questionId],
        [optionId]: isChecked,
      },
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, question) => {
      const selected = selectedOptions[question.id] ? Object.keys(selectedOptions[question.id]).filter((optionId) => selectedOptions[question.id][optionId]) : [];
      const correct = question.options.filter((option) => option.isCorrect).map((option) => option.id);
      const isCorrect = selected.length === correct.length && selected.every((id) => correct.includes(id));
      return acc + (isCorrect ? 1 : 0);
    }, 0);

    router.push(`/result?score=${score}&timeout=${timeLeft <= 0 ? 'true' : 'false'}`);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-gray-300">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold w-full text-left font-inter" style={{ fontSize: '35px', lineHeight: '42.36px' }}>Available MCQs</h1>
          <div className="text-xl text-purple-600 font-tiro" style={{ fontSize: '30px', lineHeight: '39.9px', letterSpacing: '0.16em' }}>
            <span className='flex gap-4'>
              <Image src={clock} alt="Clock" width={30} height={30} />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-8 mr-4">
            <h2 className="text-xl font-semibold mb-4 font-tiro" style={{ fontSize: '30px', lineHeight: '39.9px' }}>Question {currentQuestionIndex + 1}</h2>
            <p className="mb-4 font-tiro" style={{ fontSize: '20px', lineHeight: '26.6px' }} dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
            {currentQuestion.image && (
              <div className="mb-4 flex justify-center">
                <Image src={currentQuestion.image} alt="Question image" width={200} height={200} />
              </div>
            )}
            <div className="space-y-4 ">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border font-tiro relative hover:cursor-pointer"
                  style={{ fontSize: '20px', lineHeight: '26.6px', backgroundImage: selectedOptions[currentQuestion.id]?.[option.id] ? 'linear-gradient(to right, #741297 2%, transparent 2%)' : '' }}
                >
                  <span className="w-full ml-4">
                    {option.text}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedOptions[currentQuestion.id]?.[option.id] || false}
                    onChange={(e) => handleOptionChange(currentQuestion.id, option.id, e.target.checked)}
                    className="hidden"
                  />
                  <div className="relative">
                    <Image
                      src={selectedOptions[currentQuestion.id]?.[option.id] ? checkboxChecked : checkbox}
                      alt="Checkbox"
                      width={24}
                      height={24}
                    />
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {currentQuestionIndex > 0 && (
                <button
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg font-tiro"
                  onClick={handlePrevious}
                  style={{ fontSize: '14px', lineHeight: '18.62px' }}
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg font-tiro ml-auto"
                  onClick={handleNext}
                  style={{ fontSize: '14px', lineHeight: '18.62px' }}
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg font-tiro ml-auto"
                  onClick={handleSubmit}
                  style={{ fontSize: '14px', lineHeight: '18.62px' }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
          <div className="w-1/4 bg-white p-4 border-l shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 font-tiro" style={{ fontSize: '30px', lineHeight: '39.9px' }}>Questions</h2>
              <div className="grid grid-cols-3 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    className={`w-full py-2 rounded-lg ${index === currentQuestionIndex ? 'bg-purple-200' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <button className="mt-8 px-6 py-2 bg-green-500 text-white rounded-lg w-full font-tiro" onClick={handleSubmit}>
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
