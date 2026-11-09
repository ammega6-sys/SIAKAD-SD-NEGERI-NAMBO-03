import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Star, CheckCircle2, XCircle, Zap, Brain, Sparkles, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Sains & Lingkungan",
    question: "Organisme yang berperan menguraikan sisa-sisa makhluk hidup yang telah mati dalam ekosistem disebut...",
    options: ["Produsen", "Konsumen Primer", "Dekomposer", "Karnivora"],
    correctAnswer: 2,
    explanation: "Dekomposer (pengurai) seperti jamur dan bakteri bertugas mendaur ulang zat hara ke dalam tanah."
  },
  {
    id: 2,
    category: "Pancasila & Kebangsaan",
    question: "Lambang sila ke-4 Pancasila 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan' adalah...",
    options: ["Pohon Beringin", "Kepala Banteng", "Rantai Emas", "Padi dan Kapas"],
    correctAnswer: 1,
    explanation: "Kepala banteng melambangkan musyawarah dan kekuatan gotong royong masyarakat Indonesia."
  },
  {
    id: 3,
    category: "Matematika",
    question: "Bentuk desimal dari pecahan 3/4 adalah...",
    options: ["0,34", "0,75", "0,65", "0,80"],
    correctAnswer: 1,
    explanation: "3 dibagi 4 sama dengan 0,75 (atau 75%)."
  },
  {
    id: 4,
    category: "Literasi & Budaya",
    question: "Rumah adat khas suku Minangkabau di Sumatera Barat dinamakan...",
    options: ["Rumah Gadang", "Rumah Joglo", "Rumah Tongkonan", "Rumah Honai"],
    correctAnswer: 0,
    explanation: "Rumah Gadang bercirikan atap melengkung menyerupai tanduk kerbau yang khas."
  },
  {
    id: 5,
    category: "Sains Fisika",
    question: "Peristiwa perubahan wujud benda dari zat cair menjadi gas disebut...",
    options: ["Membeku", "Menyublim", "Menguap", "Mengkristal"],
    correctAnswer: 2,
    explanation: "Menguap adalah perubahan wujud dari cair ke gas, contohnya air mendidih."
  }
];

export const EduGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'math' | 'word'>('quiz');

  // Quiz Game State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Fast Math State
  const [mathA, setMathA] = useState(12);
  const [mathB, setMathB] = useState(7);
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+');
  const [mathInput, setMathInput] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathTimer, setMathTimer] = useState(30);
  const [mathActive, setMathActive] = useState(false);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  // Fast Math Timer
  useEffect(() => {
    let interval: any = null;
    if (mathActive && mathTimer > 0) {
      interval = setInterval(() => {
        setMathTimer(t => t - 1);
      }, 1000);
    } else if (mathTimer === 0 && mathActive) {
      setMathActive(false);
    }
    return () => clearInterval(interval);
  }, [mathActive, mathTimer]);

  const generateNewMath = () => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 5;
    let b = Math.floor(Math.random() * 15) + 2;
    if (chosenOp === '-' && b > a) {
      const temp = a;
      a = b;
      b = temp;
    }
    if (chosenOp === '×') {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 9) + 2;
    }
    setMathA(a);
    setMathB(b);
    setMathOp(chosenOp);
    setMathInput('');
  };

  const startMathGame = () => {
    setMathScore(0);
    setMathStreak(0);
    setMathTimer(30);
    setMathActive(true);
    setMathFeedback(null);
    generateNewMath();
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mathActive) return;
    const userVal = parseInt(mathInput);
    let expected = 0;
    if (mathOp === '+') expected = mathA + mathB;
    if (mathOp === '-') expected = mathA - mathB;
    if (mathOp === '×') expected = mathA * mathB;

    if (userVal === expected) {
      const bonus = mathStreak >= 3 ? 20 : 10;
      setMathScore(s => s + bonus);
      setMathStreak(st => st + 1);
      setMathFeedback(`Benar! +${bonus} poin`);
    } else {
      setMathStreak(0);
      setMathFeedback(`Kurang tepat. Jawabannya adalah ${expected}`);
    }

    generateNewMath();
  };

  // Word Guess Game
  const WORD_LIST = [
    { word: "MERDEKA", clue: "Bebas dari penjajahan dan berdiri mandiri sebagai bangsa berdaulat." },
    { word: "GARUDA", clue: "Burung mitologi yang menjadi lambang sakral negara Republik Indonesia." },
    { word: "PANCASILA", clue: "Lima dasar atau pedoman luhur hidup berbangsa dan bernegara." },
    { word: "NUSANTARA", clue: "Sebutan kepulauan wilayah tanah air Indonesia yang indah terbentang." }
  ];
  const [wordIdx, setWordIdx] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const currentWordItem = WORD_LIST[wordIdx];
  const isWordWon = currentWordItem.word.split('').every(ch => guessedLetters.includes(ch));

  const handleLetterClick = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
    }
  };

  const nextWord = () => {
    setWordIdx((wordIdx + 1) % WORD_LIST.length);
    setGuessedLetters([]);
  };

  // Quiz Handling
  const handleSelectQuizOpt = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === QUIZ_QUESTIONS[currentQIndex].correctAnswer) {
      setQuizScore(s => s + 20);
    }
  };

  const handleNextQuiz = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-2xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Zona Belajar Interaktif</span>
            <span>·</span>
            <span>Kurikulum Merdeka</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Mini Game Edukasi Siswa</h1>
          <p className="text-red-100 text-sm mt-1 max-w-xl">
            Tingkatkan ketangkasan literasi, numerasi, dan wawasan kebangsaan melalui simulasi kuis dan teka-teki edukatif yang menyenangkan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'quiz' ? 'bg-white text-red-800 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Kuis Juara Sains & Kebangsaan
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'math' ? 'bg-white text-red-800 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Tantangan Matematika Kilat
          </button>
          <button
            onClick={() => setActiveTab('word')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'word' ? 'bg-white text-red-800 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Tebak Kosakata Nusantara
          </button>
        </div>
      </div>

      {/* TAB 1: KUIS JUARA */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-3xl mx-auto">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                  {QUIZ_QUESTIONS[currentQIndex].category}
                </span>
                <span className="font-mono">
                  Soal {currentQIndex + 1} dari {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  Skor: <span className="tabular-nums font-mono">{quizScore}</span>
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                {QUIZ_QUESTIONS[currentQIndex].question}
              </h2>

              <div className="space-y-3 mb-6">
                {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
                  let btnStyle = "border-slate-200 hover:border-red-300 hover:bg-slate-50 text-slate-800";
                  if (isAnswered) {
                    if (idx === QUIZ_QUESTIONS[currentQIndex].correctAnswer) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    } else if (idx === selectedOpt) {
                      btnStyle = "border-red-500 bg-red-50 text-red-900";
                    } else {
                      btnStyle = "border-slate-200 opacity-60 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectQuizOpt(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm flex items-center justify-between transition-colors ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === QUIZ_QUESTIONS[currentQIndex].correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOpt && idx !== QUIZ_QUESTIONS[currentQIndex].correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 mb-1">Penjelasan:</p>
                  <p>{QUIZ_QUESTIONS[currentQIndex].explanation}</p>
                </div>
              )}

              <div className="flex justify-end">
                {isAnswered && (
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-xl shadow-xs hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-2"
                  >
                    {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Lihat Hasil Akhir' : 'Lanjut Soal Berikutnya'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Hebat! Kuis Selesai</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Kamu telah menyelesaikan 5 soal kuis edukasi terpadu SIAKAD dengan skor:
              </p>
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl px-8 py-4 mb-8">
                <span className="text-4xl font-extrabold text-red-700 tabular-nums font-mono">{quizScore}</span>
                <span className="text-slate-500 text-sm"> / 100 Poin</span>
              </div>
              <div>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Mainkan Lagi Kuis Ini
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAST MATH */}
      {activeTab === 'math' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-xl mx-auto text-center">
          {!mathActive ? (
            <div className="py-6">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Tantangan Matematika Kilat</h2>
              <p className="text-xs text-slate-600 mb-6 max-w-sm mx-auto leading-relaxed">
                Jawab sebanyak mungkin operasi hitung (penjumlahan, pengurangan, perkalian) dalam waktu 30 detik!
              </p>
              {mathScore > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-900">
                  Skor Terakhir Anda: <strong className="font-mono text-base">{mathScore}</strong> Poin
                </div>
              )}
              <button
                onClick={startMathGame}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Mulai Tantangan 30 Detik
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Skor: <strong className="font-mono tabular-nums text-sm">{mathScore}</strong>
                </div>
                <div className="flex items-center gap-1 text-red-600 font-bold">
                  <Zap className="w-4 h-4 fill-red-600" />
                  Streak: <span className="font-mono">{mathStreak}</span>x
                </div>
                <div className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${mathTimer <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                  ⏱ {mathTimer}s
                </div>
              </div>

              {/* Soal Matematika */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl py-8 px-4 mb-6">
                <span className="text-4xl md:text-5xl font-mono font-black text-slate-900 tracking-wider">
                  {mathA} {mathOp} {mathB} = ?
                </span>
              </div>

              <form onSubmit={handleMathSubmit} className="flex gap-2 max-w-xs mx-auto mb-4">
                <input
                  type="number"
                  autoFocus
                  value={mathInput}
                  onChange={e => setMathInput(e.target.value)}
                  placeholder="Jawabanmu..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-center text-lg font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors"
                >
                  Kirim
                </button>
              </form>

              {mathFeedback && (
                <p className={`text-xs font-semibold ${mathFeedback.startsWith('Benar') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {mathFeedback}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEBAK KATA NUSANTARA */}
      {activeTab === 'word' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Tebak Kata Kosakata Nusantara</h2>
          <p className="text-xs text-slate-600 mb-6">
            Pecahkan kata rahasia berdasarkan petunjuk deskripsi kebangsaan berikut:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-sm text-slate-800 italic">
            "{currentWordItem.clue}"
          </div>

          {/* Letter slots */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {currentWordItem.word.split('').map((char, i) => {
              const revealed = guessedLetters.includes(char);
              return (
                <div
                  key={i}
                  className={`w-10 h-12 md:w-12 md:h-14 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-black transition-all ${
                    revealed ? 'bg-red-600 border-red-600 text-white shadow-xs' : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  {revealed ? char : '_'}
                </div>
              );
            })}
          </div>

          {/* Keyboard tiles */}
          <div className="max-w-md mx-auto grid grid-cols-7 gap-1.5 mb-6">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => {
              const used = guessedLetters.includes(letter);
              return (
                <button
                  key={letter}
                  disabled={used || isWordWon}
                  onClick={() => handleLetterClick(letter)}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    used
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {isWordWon && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 mb-4 flex items-center justify-center gap-2 text-xs font-semibold">
              <Award className="w-5 h-5 text-emerald-600" />
              Luar biasa! Kamu berhasil menebak kata: <span className="font-mono font-bold text-sm">{currentWordItem.word}</span>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={nextWord}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Ganti Kata Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
