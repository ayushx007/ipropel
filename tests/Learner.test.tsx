import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Learner from '../src/app/learner/page';
import '@testing-library/jest-dom';

// Mock the fetchQuestions API call
jest.mock('../src/services/api', () => ({
  fetchQuestions: jest.fn().mockResolvedValue([
    {
      id: '1',
      question: 'What is the capital of France?',
      options: [
        { id: '1', text: 'Paris', isCorrect: true },
        { id: '2', text: 'Jardin', isCorrect: false },
        { id: '3', text: 'Chartres', isCorrect: false },
        { id: '4', text: 'New York', isCorrect: false },
      ],
      image: 'https://example.com/image.png',
    },
    {
      id: '2',
      question: 'Which of the following is a healthy diet?',
      options: [
        { id: '1', text: 'Vegan', isCorrect: true },
        { id: '2', text: 'Protein-Rich', isCorrect: true },
        { id: '3', text: 'Balanced', isCorrect: true },
        { id: '4', text: 'Junk Food', isCorrect: false },
      ],
      image: '',
    },
  ]),
}));

describe('Learner Component', () => {
  it('renders the questions correctly', async () => {
    render(<Learner />);
    
    // Wait for the questions to load
    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
      expect(screen.getByText('Which of the following is a healthy diet?')).toBeInTheDocument();
    });
  });

  it('submits the answers and calculates the score correctly', async () => {
    render(<Learner />);
    
    // Wait for the questions to load
    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Select the correct answers
    fireEvent.click(screen.getByLabelText('Paris'));
    fireEvent.click(screen.getByLabelText('Vegan'));
    fireEvent.click(screen.getByLabelText('Protein-Rich'));
    fireEvent.click(screen.getByLabelText('Balanced'));

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Check the score
    await waitFor(() => {
      expect(screen.getByText('Your Score: 2 / 2')).toBeInTheDocument();
    });
  });
});
