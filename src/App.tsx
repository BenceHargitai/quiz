import { useState } from "react";
import clsx from "clsx";
import Modal from "./Modal.tsx";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

type ButtonType = "Ellenőrzés" | "Következő";


const App = () => {
    const originalQuestions = [
        {
            id: 1,
            question: "Az ISO/OSI modell mely rétege foglalja magába a közeghozzáférés vezérlését (MAC)?",
            options: [
                "Fizikai réteg",
                "Adatkapcsolati réteg",
                "Hálózati réteg",
                "Szállítási réteg",
                "Alkalmazási réteg",
            ],
            correctAnswers: ["Adatkapcsolati réteg"],
            multiple: false,
        },
        {
            id: 2,
            question: "Melyek a Transport Layer protokolljai?",
            options: ["TCP", "UDP", "IP", "HTTP", "FTP"],
            correctAnswers: ["TCP", "UDP"],
            multiple: true,
        },
    ];

    // Fisher-Yates shuffle algorithm for randomizing arrays
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Randomize questions and options on initial load
    const [questions] = useState(() => {
        return shuffleArray(originalQuestions).map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));
    });

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [buttonState, setButtonState] = useState<ButtonType>("Ellenőrzés");
    const [modal, setModal] = useState(false);
    const [onlyStarred, setOnlyStarred] = useState(false);
    const [points, setPoints] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
    const [activeQuestions, setActiveQuestions] = useState(questions);
    const [starredQuestions] = useState<number[]>([]);

    const { width, height } = useWindowSize();



    const handleOptionClick = (option: string) => {
        if (showResult) return;

        if (activeQuestions[currentQuestion].multiple) {
            setSelectedAnswers((prev) =>
                prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option]
            );
        } else {
            setSelectedAnswers([option]);
        }
    };

    const isSelected = (option: string) => selectedAnswers.includes(option);

    const handleNext = () => {
        if (buttonState === "Ellenőrzés") {
            const currentQuestionObj = activeQuestions[currentQuestion];
            const isCorrect =
                currentQuestionObj.correctAnswers.sort().toString() ===
                selectedAnswers.sort().toString();

            if (!isCorrect) {
                setIncorrectQuestions((prev) => [...prev, currentQuestionObj.id]);
            }

            setShowResult(true);
            setButtonState("Következő");
            setPoints((prev) => (isCorrect ? prev + 1 : prev));
        } else if (currentQuestion < activeQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswers([]);
            setShowResult(false);
            setButtonState("Ellenőrzés");
        } else {
            setQuizCompleted(true);
        }
    };


    const restartQuiz = (useIncorrectOnly: boolean) => {
        if (useIncorrectOnly) {
            const wrongQuestions = shuffleArray(questions.filter(q =>
                incorrectQuestions.includes(q.id)
            )).map(q => ({
                ...q,
                options: shuffleArray(q.options)
            }));
            setActiveQuestions(wrongQuestions);
        } else {
            const newQuestions = shuffleArray(onlyStarred
                ? questions.filter(q => starredQuestions.includes(q.id))
                : questions
            ).map(q => ({
                ...q,
                options: shuffleArray(q.options)
            }));
            setActiveQuestions(newQuestions);
            setIncorrectQuestions([]);
        }

        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResult(false);
        setButtonState("Ellenőrzés");
        setPoints(0);
        setQuizCompleted(false);
    };

    const restartQuizAndClearLocalStorage = () => {
        localStorage.clear();
        restartQuiz(false);
    };

    const quizRadio = "h-4 w-4 text-gray-200";
    const quizCheckbox = "w-4 h-4";

    return (
        <div className="flex h-screen w-screen justify-center items-center bg-[#0a0a0a]">
            <button className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-md" onClick={() => restartQuizAndClearLocalStorage()}>
                Újrakezdés
            </button>
            <main className="max-w-xl p-8 border-gray-700 border rounded-lg flex flex-col w-full">
                {quizCompleted ? (
                    <div className="text-center">
                        <Confetti
                            width={width}
                            height={height}
                            recycle={false}
                            numberOfPieces={400}
                        />
                        <h1 className="text-2xl font-bold text-white">
                            Kvíz vége! Pontszám: {points}/{activeQuestions.length}
                        </h1>
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                onClick={() => restartQuiz(false)}
                            >
                                Újrakezdés
                            </button>
                            {points !== activeQuestions.length && (
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                    onClick={() => restartQuiz(true)}
                                >
                                    Újrakezdés csak a hibásakkal
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-white">
                            {activeQuestions[currentQuestion].question}
                            {activeQuestions[currentQuestion].multiple && (
                                <span className="block text-sm font-normal text-gray-400 mt-2">
                                    (Több válasz is lehetséges)
                                </span>
                            )}
                        </h1>
                        <div className="flex flex-col space-y-4 mt-4">
                            {activeQuestions[currentQuestion].options.map((option) => (
                                <label
                                    key={option}
                                    className={clsx(
                                        "flex items-center cursor-pointer p-2 rounded-md border border-gray-700 text-white",
                                        showResult
                                            ? activeQuestions[currentQuestion].correctAnswers.includes(option)
                                                ? "bg-green-600 border-green-500"
                                                : isSelected(option)
                                                    ? "bg-red-600 border-red-500"
                                                    : ""
                                            : isSelected(option)
                                                ? "bg-blue-600 border-blue-500"
                                                : "hover:bg-gray-800"
                                    )}
                                >
                                    <input
                                        type={
                                            activeQuestions[currentQuestion].multiple
                                                ? "checkbox"
                                                : "radio"
                                        }
                                        checked={isSelected(option)}
                                        onChange={() => handleOptionClick(option)}
                                        className={
                                            activeQuestions[currentQuestion].multiple
                                                ? quizCheckbox
                                                : quizRadio
                                        }
                                        name={
                                            activeQuestions[currentQuestion].multiple
                                                ? option
                                                : "quiz-option"
                                        }
                                    />
                                    <span className="px-2 py-1.5">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between mt-8">
                            <div className="flex items-center gap-4 pl-2">
                                <span className="text-white text-base">
                                    {currentQuestion + 1}/{activeQuestions.length}
                                </span>
                            </div>
                            <button
                                onClick={handleNext}
                                className={clsx(
                                    "px-4 p-3 rounded-md border border-gray-700 text-white max-w-40 w-full",
                                    showResult
                                        ? "bg-blue-600 border-blue-500"
                                        : "bg-gray-800 hover:bg-gray-700"
                                )}
                            >
                                {buttonState}
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Modal
                modal={modal}
                setModal={setModal}
                onlyStarred={onlyStarred}
                setOnlyStarred={setOnlyStarred}
            />
        </div>
    );
};

export default App;