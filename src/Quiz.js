import React, { useState, useEffect } from 'react';
import quizData from './quizData';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title);

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60 * 10 + 28); // Example: 10:28 timer
  const [correctCount, setCorrectCount] = useState(0);

  const handleAnswerOptionClick = (option) => {
    setSelectedAnswer(option);
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option
    });
    if (option === quizData[currentQuestion].answer) {
      setCorrectCount(prevCount => prevCount + 1);
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(""); // Reset selection for next question
    } else {
      // Optionally handle case where Next is clicked on the last question
      // Maybe disable Next or trigger submit?
      handleSubmit(); // Or just submit
    }
  };

  const handlePrevious = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      setSelectedAnswer(""); // Reset selection
    }
  };

  const handleSubmit = () => {
    setScore(correctCount);
    setShowScore(true);
  };

  // Function to get the letter for the option index
  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Submit automatically when time runs out
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  // Format time left as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Chart data and options inside component to access state
  const data = {
    labels: ['Correct', 'Not Correct', 'Left Blank'],
    datasets: [
      {
        label: 'Quiz Results',
        data: [
          correctCount,
          Object.keys(selectedAnswers).length - correctCount,
          quizData.length - Object.keys(selectedAnswers).length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='quiz'>
      {showScore ? (
        <>
          <div className='score-section'>
            You scored {correctCount} out of {quizData.length}
          </div>
          <Bar data={data} options={options} />
          <div className='correct-answers'>
            {quizData.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              if (userAnswer && userAnswer !== question.answer) {
                return (
                  <div key={index} className='answer-review'>
                    <div>Question {index + 1}: {question.question}</div>
                    <div className='incorrect'>Your answer: {userAnswer}</div>
                    <div className='correct'>Correct answer: {question.answer}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </>
      ) : (
        <>
          <div className='question-header'>
            <div className='question-count'>Question {currentQuestion + 1}</div>
            <div className='timer'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
              </svg>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className='question-section'>
            <div className='question-text'>{quizData[currentQuestion].question}</div>
          </div>
          <div className='answer-section'>
            {quizData[currentQuestion].options.map((option, index) => (
              <div
                key={option}
                className={`option-container ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerOptionClick(option)}
              >
                <div className='option-letter'>{getOptionLetter(index)}</div>
                <div className='option-text'>{option}</div>
              </div>
            ))}
          </div>
          <div className='navigation-buttons'>
            <button onClick={handlePrevious} disabled={currentQuestion === 0} className='nav-button prev-button'>Previous</button>
            <button onClick={handleNext} disabled={currentQuestion === quizData.length - 1} className='nav-button next-button'>Next</button>
            <button onClick={handleSubmit} className='nav-button submit-button'>Submit</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;