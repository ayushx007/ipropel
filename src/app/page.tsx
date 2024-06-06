'use client';
import Link from 'next/link';
import Image from 'next/image';
import instructorImage from '../../public/instructor.svg'
import learnerImage from '../../public/learner.svg';
import logo from '../../public/logo.svg';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image className='mb-8 -translate-x-4' src={logo} alt="MCQ Logo" width={300} height={150} />
      <p className="text-lg font-bold mb-2">Welcome to the MCQ website</p>
      <p className="text-lg mb-8 text-gray-800">Navigate to instructor or learner to continue</p>
      <div className="flex space-x-8">
        <Link href="/instructor" className="flex flex-col items-center border border-black bg-white p-6 rounded-lg shadow-2xl transform transition-transform hover:scale-105">
          <Image src={instructorImage} alt="Instructor" width={120} height={150} />
          <h2 className="text-2xl font-bold mt-4">Instructor</h2>
          <p className="text-center mt-2 text-gray-600">
            If you&apos;re an instructor, please proceed to create the MCQs.
          </p>
        </Link>
        <Link href="/learner" className="flex flex-col items-center border border-black bg-white p-6 rounded-lg shadow-2xl transform transition-transform hover:scale-105">
          <Image src={learnerImage} alt="Learner" width={150} height={150} />
          <h2 className="text-2xl font-bold mt-4">Learner</h2>
          <p className="text-center mt-2 text-gray-600">
            If you&apos;re a student, please proceed to attempt the MCQs.
          </p>
        </Link>
      </div>
    </div>
  );
}