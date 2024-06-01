'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import RichTextEditor from '../../components/TextEditor';
import { createQuestion, fetchQuestions, deleteQuestion } from '../../services/api';

const Instructor = () => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<{ id: string, text: string, isCorrect: boolean }[]>([{ id: '1', text: '', isCorrect: false }]);
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await fetchQuestions();
    setQuestions(data);
  };

  const handleAddOption = () => {
    setOptions([...options, { id: (options.length + 1).toString(), text: '', isCorrect: false }]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index: number, value: boolean) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = value;
    setOptions(newOptions);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          setImagePreview(reader.result as string);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ image: reader.result }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Image upload failed');
          }

          const data = await response.json();
          setImage(data.url);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const mcq = {
      question,
      options,
      image,
    };
    await createQuestion(mcq);
    loadQuestions();
  };

  const handleDelete = async (id: string) => {
    await deleteQuestion(id);
    loadQuestions();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create MCQ</h1>
      <RichTextEditor value={question} onChange={setQuestion} />
      <div className="my-4">
        <input type="file" onChange={handleImageUpload} />
        {imagePreview && (
          <div className="relative w-full h-64 mt-4">
            <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="contain" />
          </div>
        )}
      </div>
      {options.map((option, index) => (
        <div key={index} className="flex items-center my-2">
          <input
            type="text"
            value={option.text}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="border p-2 flex-1"
          />
          <input
            type="checkbox"
            checked={option.isCorrect}
            onChange={(e) => handleCorrectChange(index, e.target.checked)}
            className="ml-2"
          />
          <label className="ml-2">Correct</label>
        </div>
      ))}
      <button onClick={handleAddOption} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Option
      </button>
      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded ml-2">
        Submit
      </button>

      <h2 className="text-2xl font-bold mt-8 mb-4">Posted Questions</h2>
      {questions.map((q) => (
        <div key={q.id} className="border p-4 mb-4">
          <div dangerouslySetInnerHTML={{ __html: q.question }} />
          {q.options.map((option: any) => (
            <div key={option.id}>
              <p>{option.text} {option.isCorrect && <span>(Correct)</span>}</p>
            </div>
          ))}
          {q.image && (
            <div className="relative w-full h-64 mt-4">
              <Image src={q.image} alt="Question Image" layout="fill" objectFit="contain" />
            </div>
          )}
          <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Instructor;
