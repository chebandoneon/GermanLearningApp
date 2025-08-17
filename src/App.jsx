
import './App.css';
import { useEffect, useState } from 'react';

const lessons = [
  {
    id: 1,
    title: 'Verbkonjugation: Präsens',
    description: 'Lerne die Konjugation von regelmäßigen und unregelmäßigen Verben im Präsens.',
    exercises: [
      { type: 'fill', question: 'Ich ____ (gehen) zur Schule.', answer: 'gehe' },
      { type: 'choice', question: 'Welche ist die richtige Form von "sein" für "wir"?', options: ['bin', 'bist', 'sind', 'seid'], answer: 'sind' },
      { type: 'fill', question: 'Du ____ (haben) ein Buch.', answer: 'hast' },
    ],
  },
  {
    id: 2,
    title: 'Vergangenheitsformen',
    description: 'Übe das Präteritum und Perfekt.',
    exercises: [
      { type: 'fill', question: 'Gestern ____ (spielen) ich Fußball.', answer: 'spielte' },
      { type: 'choice', question: 'Was ist das Partizip II von "sehen"?', options: ['gesehen', 'seht', 'gesehenen', 'gesehenes'], answer: 'gesehen' },
      { type: 'choice', question: 'Präteritum von "gehen"', options: ['ging', 'gegangen', 'geht', 'gingen'], answer: 'ging' },
    ],
  },
  {
    id: 3,
    title: 'Rechtschreibung',
    description: 'Teste dein Wissen über die richtige Schreibweise.',
    exercises: [
      { type: 'choice', question: 'Was ist richtig geschrieben?', options: ['Fahrrad', 'Fahrad', 'Fahrraad', 'Fahrad'], answer: 'Fahrrad' },
      { type: 'fill', question: '____ (groß) oder klein geschrieben: "Haus"?', answer: 'Groß' },
      { type: 'choice', question: 'Richtige Schreibweise: "viel(e)"?', options: ['viele', 'vielee', 'vihl', 'viel'], answer: 'viele' },
    ],
  },
  {
    id: 4,
    title: 'Modalverben',
    description: 'können, dürfen, müssen im Gebrauch üben.',
    exercises: [
      { type: 'fill', question: 'Er ____ (müssen) pünktlich sein.', answer: 'muss' },
      { type: 'choice', question: 'Wir ____ (können) singen.', options: ['kann', 'können', 'könnt', 'könne'], answer: 'können' },
    ],
  },
  {
    id: 5,
    title: 'Satzbau & Wortstellung',
    description: 'Haupt- und Nebensatz, Verbzweitstellung.',
    exercises: [
      { type: 'fill', question: 'Morgen ____ (gehen) ich ins Kino.', answer: 'gehe' },
      { type: 'choice', question: 'In Nebensätzen steht das Verb am:', options: ['Anfang', 'Zweit', 'Ende', 'Mitte'], answer: 'Ende' },
    ],
  },
  {
    id: 6,
    title: 'Trennbare Verben',
    description: 'Verben mit Präfixen: aufstehen, einkaufen, anrufen.',
    exercises: [
      { type: 'fill', question: 'Ich ____ (aufstehen) um 7 Uhr.', answer: 'stehe auf' },
      { type: 'choice', question: 'Trennbares Verb: "einkaufen" — Präsens für er', options: ['kauft ein', 'einkauft', 'kauft'], answer: 'kauft ein' },
    ],
  },
  {
    id: 7,
    title: 'Untrennbare Verben',
    description: 'Verben ohne Trennung: besuchen, erzählen.',
    exercises: [
      { type: 'fill', question: 'Wir ____ (besuchen) Oma am Sonntag.', answer: 'besuchen' },
    ],
  },
  {
    id: 8,
    title: 'Reflexive Verben',
    description: 'sich freuen, sich erinnern, sich setzen.',
    exercises: [
      { type: 'choice', question: 'Richtige Form: "ich ____ mich freuen"', options: ['werde', 'freue', 'freue mich', 'mich freue'], answer: 'freue mich' },
    ],
  },
  {
    id: 9,
    title: 'Pronomen',
    description: 'Personal-, Possessiv- und Relativpronomen.',
    exercises: [
      { type: 'choice', question: 'Possessiv: "mein" passt zu?', options: ['ich', 'du', 'er', 'wir'], answer: 'ich' },
    ],
  },
  {
    id: 10,
    title: 'Adjektivdeklination',
    description: 'Starke und schwache Deklination üben.',
    exercises: [
      { type: 'fill', question: 'Das ist ein ____ (groß) Haus.', answer: 'großes' },
    ],
  },
  {
    id: 11,
    title: 'Komparativ & Superlativ',
    description: 'schneller, am schnellsten — Vergleichsformen.',
    exercises: [
      { type: 'choice', question: 'Superlativ von "klein"', options: ['kleiner', 'am kleinsten', 'kleinsten', 'kleinste'], answer: 'am kleinsten' },
    ],
  },
  {
    id: 12,
    title: 'Präpositionen mit Dativ',
    description: 'mit, nach, bei, seit, von, zu.',
    exercises: [
      { type: 'fill', question: 'Ich fahre ____ (mit) dem Bus.', answer: 'mit' },
    ],
  },
  {
    id: 13,
    title: 'Präpositionen mit Akkusativ',
    description: 'durch, für, ohne, um.',
    exercises: [
      { type: 'choice', question: 'Präposition für Ziel: "Wir gehen ____ das Haus"', options: ['in', 'an', 'durch', 'um'], answer: 'in' },
    ],
  },
  {
    id: 14,
    title: 'Konjunktionen',
    description: 'und, oder, aber, denn, weil, dass.',
    exercises: [
      { type: 'fill', question: 'Ich mag Äpfel, ____ ich esse gern Bananen.', answer: 'aber' },
    ],
  },
  {
    id: 15,
    title: 'Direkt und indirekt',
    description: 'Direkte Rede vs. indirekte Rede.',
    exercises: [
      { type: 'choice', question: 'Indirekte Rede verwendet oft: ', options: ['dass', 'und', 'aber', 'oder'], answer: 'dass' },
    ],
  },
  {
    id: 16,
    title: 'Fragewörter',
    description: 'Wer, Was, Wann, Warum, Wie, Wo.',
    exercises: [
      { type: 'fill', question: '____ kommst du?', answer: 'Wann' },
    ],
  },
  {
    id: 17,
    title: 'Negation',
    description: 'nicht vs. kein(e).',
    exercises: [
      { type: 'choice', question: 'Negation: "Ich habe ____ Geld"', options: ['kein', 'nicht', 'noch', 'nur'], answer: 'kein' },
    ],
  },
  {
    id: 18,
    title: 'Partizip I/II',
    description: 'Bildung und Verwendung von Partizipien.',
    exercises: [
      { type: 'fill', question: 'Partizip II von "machen"', answer: 'gemacht' },
    ],
  },
  {
    id: 19,
    title: 'Konjunktiv II',
    description: 'Wünsche und Irreales (würde-Form).',
    exercises: [
      { type: 'choice', question: 'Konjunktiv II von "haben"', options: ['hätte', 'hatte', 'haben', 'würde haben'], answer: 'hätte' },
    ],
  },
  {
    id: 20,
    title: 'Indirekte Fragen',
    description: 'Satzbau bei eingebetteten Fragen.',
    exercises: [
      { type: 'fill', question: 'Er fragt, ____ du kommst.', answer: 'ob' },
    ],
  },
  {
    id: 21,
    title: 'Bindewörter & Satzverknüpfung',
    description: 'daher, trotzdem, außerdem.',
    exercises: [
      { type: 'choice', question: 'Synonym für "außerdem"', options: ['außer', 'zusätzlich', 'aber', 'denn'], answer: 'zusätzlich' },
    ],
  },
  {
    id: 22,
    title: 'Nominalisierung',
    description: 'Verben und Adjektive als Nomen verwenden.',
    exercises: [
      { type: 'fill', question: 'Das ____ (laufen) war anstrengend.', answer: 'Laufen' },
    ],
  },
  {
    id: 23,
    title: 'Satzzeichen',
    description: 'Kommasetzung, Punkt, Fragezeichen, Ausrufezeichen.',
    exercises: [
      { type: 'choice', question: 'Komma: Nebensatz trennt man mit', options: ['.', ',', ';', ':'], answer: ',' },
    ],
  },
  {
    id: 24,
    title: 'Wortarten Wiederholung',
    description: 'Nomen, Verb, Adjektiv, Adverb, Präposition.',
    exercises: [
      { type: 'fill', question: 'Ein Wort, das eine Handlung beschreibt ist ein ____.', answer: 'Verb' },
    ],
  },
  {
    id: 25,
    title: 'Gymnasium-Übungstest',
    description: 'Gemischte Aufgaben im Prüfungsstil zur Vorbereitung.',
    exercises: [
      { type: 'choice', question: 'Welche Zeitform steht für abgeschlossene Handlung in der Vergangenheit?', options: ['Präteritum', 'Präsens', 'Futur', 'Plusquamperfekt'], answer: 'Präteritum' },
      { type: 'fill', question: 'Ich ____ (haben) gestern viel gelernt.', answer: 'hatte' },
    ],
  },
];

function Exercise({ exercise, onAnswer, answered }) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleFill = () => {
    if (input.trim().toLowerCase() === exercise.answer.toLowerCase()) {
      setFeedback('✅ Richtig!');
      onAnswer(true);
    } else {
      setFeedback(`❌ Falsch — richtige Antwort: ${exercise.answer}`);
      onAnswer(false);
    }
  };

  const handleChoice = (option) => {
    setSelected(option);
    if (option === exercise.answer) {
      setFeedback('✅ Richtig!');
      onAnswer(true);
    } else {
      setFeedback(`❌ Falsch — richtige Antwort: ${exercise.answer}`);
      onAnswer(false);
    }
  };

  return (
    <div className="exercise-box">
      <p>{exercise.question}</p>
      {exercise.type === 'fill' && (
        <div>
          <input
            type="text"
            value={input}
            disabled={answered}
            onChange={evt => setInput(evt.target.value)}
            placeholder="Antwort eingeben..."
            aria-label="Antwort"
          />
          <button onClick={handleFill} disabled={answered}>Antwort prüfen</button>
        </div>
      )}
      {exercise.type === 'choice' && (
        <div>
          {exercise.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleChoice(opt)}
              disabled={answered}
              className={selected === opt ? 'selected' : ''}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
}

function Lesson({ lesson, onComplete, giveXP }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (correct) => {
    setAnswered(true);
    if (correct) {
      setScore(score + 1);
      giveXP(10);
    }
    setTimeout(() => {
      setAnswered(false);
      if (current < lesson.exercises.length - 1) {
        setCurrent(current + 1);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 900);
  };

  return (
    <div className="lesson-box">
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
      <Exercise
        exercise={lesson.exercises[current]}
        onAnswer={handleAnswer}
        answered={answered}
      />
      <div className="progress">Frage {current + 1} von {lesson.exercises.length}</div>
    </div>
  );
}

function Progress({ scores }) {
  return (
    <div className="progress-box">
      <h2>Fortschritt</h2>
      <ul>
        {lessons.map((l) => (
          <li key={l.id}>
            {l.title}: {(() => {
              const idx = lessons.findIndex(x => x.id === l.id);
              return scores[idx] !== undefined ? `${scores[idx]} / ${l.exercises.length}` : 'Nicht begonnen';
            })()}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgressChart({ scores }) {
  // simple text-based chart because no chart library is included
  const total = lessons.reduce((acc, l) => acc + l.exercises.length, 0);
  const done = scores.reduce((acc, s) => acc + (s ? s : 0), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progress-chart">
      <h3>Übersicht</h3>
      <div className="bar">
        <div className="bar-inner" style={{ width: `${pct}%` }}>{pct}%</div>
      </div>
      <div className="chart-details">Aufgaben erledigt: {done} / {total}</div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('home');
  const [activeLesson, setActiveLesson] = useState(null);
  const [scores, setScores] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  // load persistent state
  useEffect(() => {
    try {
      const raw = localStorage.getItem('german-trainer-state');
      if (raw) {
        const s = JSON.parse(raw);
        setXp(s.xp || 0);
        setStreak(s.streak || 0);
        setBadges(s.badges || []);
        setScores(s.scores || []);
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  useEffect(() => {
    const s = { xp, streak, badges, scores };
    localStorage.setItem('german-trainer-state', JSON.stringify(s));
  }, [xp, streak, badges, scores]);

  const startLesson = (idx) => {
    setActiveLesson(idx);
    setView('lesson');
  };

  const giveXP = (amount) => {
    setXp(prev => {
      const next = prev + amount;
      // award badges at thresholds
      if (next >= 100 && !badges.includes('Bronze')) setBadges(b => [...b, 'Bronze']);
      if (next >= 300 && !badges.includes('Silber')) setBadges(b => [...b, 'Silber']);
      if (next >= 700 && !badges.includes('Gold')) setBadges(b => [...b, 'Gold']);
      return next;
    });
    // simple streak logic: increment streak for session correct answer
    setStreak(s => s + 1);
  };

  const completeLesson = (score) => {
    const newScores = [...scores];
    newScores[activeLesson] = score;
    setScores(newScores);
    setView('progress');
  };

  const resetProgress = () => {
    setScores([]);
    setXp(0);
    setStreak(0);
    setBadges([]);
    localStorage.removeItem('german-trainer-state');
  };

  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="app-container">
      <header>
        <h1>Deutsch Grammatik Trainer</h1>
        <div className="meta">
          <div>XP: {xp} • Level: {level} • Serie: {streak}</div>
          <div>Abzeichen: {badges.length ? badges.join(', ') : '—'}</div>
        </div>
        <nav>
          <button onClick={() => setView('home')}>Startseite</button>
          <button onClick={() => setView('progress')}>Fortschritt</button>
          <button onClick={resetProgress}>Fortschritt zurücksetzen</button>
        </nav>
      </header>
      <main>
        {view === 'home' && (
          <div className="home-box">
            <h2>Willkommen!</h2>
            <p>Bereite dich interaktiv auf die Gymnasium-Prüfung vor. Wähle eine Lektion:</p>
            <ul>
              {lessons.map((l, idx) => (
                <li key={l.id}>
                  <button onClick={() => startLesson(idx)}>{l.title}</button>
                  <span style={{ marginLeft: '1em', color: '#888' }}>{l.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {view === 'lesson' && (
          <Lesson lesson={lessons[activeLesson]} onComplete={completeLesson} giveXP={giveXP} />
        )}
        {view === 'progress' && (
          <>
            <Progress scores={scores} />
            <ProgressChart scores={scores} />
            <div className="export-import">
              <h3>Export / Import Fortschritt</h3>
              <button onClick={() => {
                const data = { xp, streak, badges, scores };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'german-trainer-progress.json';
                a.click();
                URL.revokeObjectURL(url);
              }}>Exportieren (JSON)</button>
              <div style={{ marginTop: '0.6em' }}>
                <input id="import-file" type="file" accept="application/json" onChange={(ev) => {
                  const f = ev.target.files && ev.target.files[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const parsed = JSON.parse(reader.result);
                      if (parsed.xp !== undefined) setXp(parsed.xp);
                      if (parsed.streak !== undefined) setStreak(parsed.streak);
                      if (parsed.badges !== undefined) setBadges(parsed.badges);
                      if (parsed.scores !== undefined) setScores(parsed.scores);
                    } catch {
                      alert('Ungültige Datei');
                    }
                  };
                  reader.readAsText(f);
                }} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
