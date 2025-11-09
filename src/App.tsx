import './App.css';
import { useEffect, useMemo, useState } from 'react';

type QuestionType = 'multiple-choice' | 'free-text' | 'numeric';

type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 'leicht' | 'mittel' | 'anspruchsvoll';
  focus: string;
};

type Topic = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  focusAreas: string[];
  generate: () => Question;
};

type AnswerRecord = {
  question: Question;
  userAnswer: string;
  correct: boolean;
};

type SessionSummary = {
  topicId: string;
  topicTitle: string;
  correct: number;
  total: number;
  timestamp: string;
};

const qualitySeals = [
  'KI-Fragenstudio Zürich – menschlich geprüft',
  'Generiert von Sprach-KI, validiert von Fachlehrpersonen',
  'Adaptives Prüfungsset • Qualitätscheck bestanden',
  'Smart Authoring Pipeline mit QS-Siegel',
];

const badgeThresholds = [
  { xp: 120, label: 'Starter-Badge' },
  { xp: 360, label: 'Fortgeschritten' },
  { xp: 720, label: 'Expert:in Zürich' },
];

const randomId = () => Math.random().toString(36).slice(2, 10);
const pick = <T,>(values: T[]): T => values[Math.floor(Math.random() * values.length)];

const shuffle = <T,>(arr: T[]): T[] => {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const generateDeutschQuestion = (): Question => {
  const templates = ['luecke', 'textverstehen', 'wortwahl', 'zeichensetzung'] as const;
  const template = pick(templates);

  if (template === 'luecke') {
    const sentences = [
      {
        prompt: 'Setze die passende Verbform ein: „Wir ____ morgen ins Liceo“',
        answer: 'gehen',
        focus: 'Verbformen Präsens',
      },
      {
        prompt: 'Setze den korrekten Artikel ein: „____ Eintritt ist kostenpflichtig.“',
        answer: 'Der',
        focus: 'Artikel & Kasus',
      },
      {
        prompt: 'Ergänze das passende Pronomen: „Das ist die Schülerin, ____ die beste Note schrieb.“',
        answer: 'die',
        focus: 'Relativpronomen',
      },
    ];
    const chosen = pick(sentences);
    return {
      id: randomId(),
      prompt: chosen.prompt,
      type: 'free-text',
      answer: chosen.answer,
      explanation: `Korrekte Lösung: "${chosen.answer}" – Fokus: ${chosen.focus}.`,
      difficulty: 'leicht',
      focus: chosen.focus,
    };
  }

  if (template === 'textverstehen') {
    const passages = [
      {
        text: '„Der Tag der Aufnahmeprüfung verlangt Konzentration. Eine ruhige Vorbereitung am Vorabend hilft, strukturiert zu bleiben.“',
        question: 'Welche Empfehlung gibt der Text für den Vorabend?',
        options: [
          'Noch einmal vier Stunden lernen',
          'Frühzeitig entspannen und ruhig bleiben',
          'Mit Freunden feiern gehen',
          'Direkt in die Prüfung fahren',
        ],
        answer: 'Frühzeitig entspannen und ruhig bleiben',
        focus: 'Lesekompetenz',
      },
      {
        text: '„In der Deutschprüfung zählen klare Argumente und eine präzise Sprache. Beispielhafte Begründungen sollten mit konkreten Erlebnissen verknüpft sein.“',
        question: 'Was ist laut Text wichtig für Argumente?',
        options: [
          'Viele Fremdwörter verwenden',
          'Konkrete Erlebnisse als Beispiele nutzen',
          'Besonders lange Sätze schreiben',
          'Auf eine Einleitung verzichten',
        ],
        answer: 'Konkrete Erlebnisse als Beispiele nutzen',
        focus: 'Argumentation',
      },
    ];
    const chosen = pick(passages);
    return {
      id: randomId(),
      prompt: `${chosen.text}\nFrage: ${chosen.question}`,
      type: 'multiple-choice',
      options: shuffle(chosen.options),
      answer: chosen.answer,
      explanation: 'Die richtige Option fasst den Kerngedanken des Textes präzise zusammen.',
      difficulty: 'mittel',
      focus: chosen.focus,
    };
  }

  if (template === 'wortwahl') {
    const base = [
      {
        stem: 'anspruchsvoll',
        question: 'Wähle das treffendste Synonym für „anspruchsvoll“ im Prüfungskontext.',
        options: ['herausfordernd', 'leicht', 'belanglos', 'langweilig'],
      },
      {
        stem: 'präzise',
        question: 'Welches Wort passt als Synonym zu „präzise“?',
        options: ['genau', 'ungefähr', 'langatmig', 'großzügig'],
      },
    ];
    const chosen = pick(base);
    return {
      id: randomId(),
      prompt: chosen.question,
      type: 'multiple-choice',
      options: shuffle(chosen.options),
      answer: chosen.options[0],
      explanation: `„${chosen.options[0]}“ transportiert denselben Bedeutungsgehalt wie „${chosen.stem}“.`,
      difficulty: 'leicht',
      focus: 'Wortschatz',
    };
  }

  const commas = [
    {
      sentence: 'Wir schreiben den Essay __ wir klare Argumente gesammelt haben.',
      answer: 'wenn',
      focus: 'Nebensatz',
    },
    {
      sentence: 'Die Lehrerin sagte __ die Klasse solle ruhig bleiben.',
      answer: 'dass',
      focus: 'Konjunktion',
    },
  ];
  const chosen = pick(commas);
  return {
    id: randomId(),
    prompt: `Ergänze das Bindewort richtig: „${chosen.sentence}“`,
    type: 'free-text',
    answer: chosen.answer,
    explanation: `Die Konjunktion „${chosen.answer}“ verbindet Haupt- und Nebensatz korrekt.`,
    difficulty: 'mittel',
    focus: chosen.focus,
  };
};

const generateMatheQuestion = (): Question => {
  const templates = ['prozent', 'gleichung', 'flaeche', 'brueche'] as const;
  const template = pick(templates);

  if (template === 'prozent') {
    const grundwert = 80 + Math.floor(Math.random() * 60); // 80-139
    const prozentsatz = pick([12, 15, 18, 25]);
    const wert = Math.round((grundwert * prozentsatz) / 100);
    const distractors = [wert + 5, wert - 4, wert + 8].map((v) => `${v}`);
    return {
      id: randomId(),
      prompt: `Berechne ${prozentsatz}% von ${grundwert}.`,
      type: 'multiple-choice',
      options: shuffle([`${wert}`, ...distractors]),
      answer: `${wert}`,
      explanation: `${grundwert} · ${prozentsatz} / 100 = ${wert}.`,
      difficulty: 'mittel',
      focus: 'Prozentrechnung',
    };
  }

  if (template === 'gleichung') {
    const x = 2 + Math.floor(Math.random() * 8);
    const faktor = pick([3, 4, 5]);
    const plus = pick([4, 6, 8, 10]);
    const rechteSeite = faktor * x + plus;
    return {
      id: randomId(),
      prompt: `Löse nach x auf: ${faktor}x + ${plus} = ${rechteSeite}.`,
      type: 'numeric',
      answer: `${x}`,
      explanation: `${rechteSeite} - ${plus} = ${faktor * x}; geteilt durch ${faktor} ergibt x = ${x}.`,
      difficulty: 'mittel',
      focus: 'Lineare Gleichungen',
    };
  }

  if (template === 'flaeche') {
    const laenge = 6 + Math.floor(Math.random() * 6);
    const breite = 4 + Math.floor(Math.random() * 5);
    const flaeche = laenge * breite;
    const options = shuffle([flaeche, flaeche + laenge, flaeche - breite, flaeche + 8].map((n) => `${n}`));
    return {
      id: randomId(),
      prompt: `Eine Rechteckfläche misst ${laenge} cm · ${breite} cm. Wie groß ist die Fläche?`,
      type: 'multiple-choice',
      options,
      answer: `${flaeche}`,
      explanation: `Fläche = Länge · Breite = ${laenge} · ${breite} = ${flaeche} cm².`,
      difficulty: 'leicht',
      focus: 'Geometrie',
    };
  }

  const zaehler = 1 + Math.floor(Math.random() * 8);
  const nenner = pick([4, 5, 6, 8]);
  const prozent = Math.round((zaehler / nenner) * 100);
  return {
    id: randomId(),
    prompt: `Wandle den Bruch ${zaehler}/${nenner} in Prozent um (gerundet auf ganze Prozent).`,
    type: 'numeric',
    answer: `${prozent}`,
    explanation: `${zaehler} ÷ ${nenner} · 100 = ${prozent}%.`,
    difficulty: 'anspruchsvoll',
    focus: 'Bruch zu Prozent',
  };
};

const generateLogikQuestion = (): Question => {
  const templates = ['folgen', 'verstehen', 'textlogik'] as const;
  const template = pick(templates);

  if (template === 'folgen') {
    const start = 3 + Math.floor(Math.random() * 5);
    const differenz = pick([2, 3, 4]);
    const folge = Array.from({ length: 4 }, (_, i) => start + i * differenz);
    const next = start + 4 * differenz;
    const options = shuffle([next, next + 2, next - 3, next + 5].map((n) => `${n}`));
    return {
      id: randomId(),
      prompt: `Zahlenfolge: ${folge.join(', ')}, …? Was folgt als Nächstes?`,
      type: 'multiple-choice',
      options,
      answer: `${next}`,
      explanation: `Die Differenz beträgt konstant ${differenz}.`,
      difficulty: 'leicht',
      focus: 'Zahlenmuster',
    };
  }

  if (template === 'verstehen') {
    const statements = [
      {
        premise: 'Wenn es regnet, findet das Fussballtraining in der Halle statt. Heute regnet es.',
        question: 'Wo findet das Training statt?',
        answer: 'In der Halle',
      },
      {
        premise: 'Alle Schülerinnen im Lernatelier haben ein Tablet. Mia arbeitet im Lernatelier.',
        question: 'Was gilt für Mia?',
        answer: 'Sie hat ein Tablet',
      },
    ];
    const chosen = pick(statements);
    return {
      id: randomId(),
      prompt: `${chosen.premise}\nSchlussfolgerung: ${chosen.question}`,
      type: 'multiple-choice',
      options: shuffle([
        chosen.answer,
        'Es findet nicht statt',
        'Die Information reicht nicht',
        'Das Training wird verschoben',
      ]),
      answer: chosen.answer,
      explanation: 'Es handelt sich um eine direkte Wenn-dann-Folgerung (Modus Ponens).',
      difficulty: 'mittel',
      focus: 'Logische Deduktion',
    };
  }

  const arrangements = [
    {
      prompt: 'Drei Freund:innen (Anna, Ben, Célia) schreiben nacheinander eine Prüfung. Anna möchte nicht als Erste starten. Wie viele gültige Reihenfolgen gibt es?',
      answer: '4',
      explanation: 'Es gibt 3! = 6 Permutationen. Zwei davon beginnen mit Anna und entfallen. Bleiben 4.',
    },
    {
      prompt: 'Zwei Aussagen: A) „Alle Bücher sind beschriftet.“ B) „Manche Bücher sind beschriftet.“ Welche Aussage folgt logisch aus B?',
      answer: 'Mindestens ein Buch ist beschriftet',
      explanation: '„Manche“ impliziert die Existenz von mindestens einem Element mit der Eigenschaft.',
    },
  ];
  const chosen = pick(arrangements);
  if (chosen.answer === '4') {
    return {
      id: randomId(),
      prompt: chosen.prompt,
      type: 'numeric',
      answer: chosen.answer,
      explanation: chosen.explanation,
      difficulty: 'anspruchsvoll',
      focus: 'Kombinatorik',
    };
  }
  return {
    id: randomId(),
    prompt: chosen.prompt,
    type: 'multiple-choice',
    options: shuffle([
      chosen.answer,
      'Alle Bücher sind beschriftet',
      'Kein Buch ist beschriftet',
      'Die Aussage ist falsch',
    ]),
    answer: chosen.answer,
    explanation: chosen.explanation,
    difficulty: 'mittel',
    focus: 'Aussagenlogik',
  };
};

const generateRealienQuestion = (): Question => {
  const templates = ['geografie', 'politik', 'geschichte', 'kultur'] as const;
  const template = pick(templates);

  if (template === 'geografie') {
    const rivers = [
      {
        question: 'Welcher Fluss prägt die Stadt Zürich?',
        answer: 'Limmat',
        options: ['Limmat', 'Aare', 'Reuss', 'Rhein'],
      },
      {
        question: 'Wie heißt der See vor Zürich?',
        answer: 'Zürichsee',
        options: ['Zürichsee', 'Bielersee', 'Genfersee', 'Walensee'],
      },
    ];
    const chosen = pick(rivers);
    return {
      id: randomId(),
      prompt: chosen.question,
      type: 'multiple-choice',
      options: shuffle(chosen.options),
      answer: chosen.answer,
      explanation: 'Topografie und Orientierung sind Teil der Allgemeinbildung in der Aufnahmeprüfung.',
      difficulty: 'leicht',
      focus: 'Kanton Zürich – Geografie',
    };
  }

  if (template === 'politik') {
    const councilMembers = [
      {
        prompt: 'Wie viele Gemeinden hat der Kanton Zürich (gerundet auf Zehner)?',
        answer: '160',
        explanation: 'Aktuell zählt der Kanton rund 160 Gemeinden (leichte Schwankung durch Fusionen).',
      },
      {
        prompt: 'Wie heißt das Parlament des Kantons Zürich?',
        answer: 'Kantonsrat',
        explanation: 'Der Kantonsrat ist die Legislative des Kantons Zürich.',
      },
    ];
    const chosen = pick(councilMembers);
    if (chosen.answer === '160') {
      return {
        id: randomId(),
        prompt: chosen.prompt,
        type: 'numeric',
        answer: chosen.answer,
        explanation: chosen.explanation,
        difficulty: 'anspruchsvoll',
        focus: 'Politische Bildung',
      };
    }
    return {
      id: randomId(),
      prompt: chosen.prompt,
      type: 'multiple-choice',
      options: shuffle(['Kantonsrat', 'Nationalrat', 'Regierungsrat', 'Gemeinderat']),
      answer: chosen.answer,
      explanation: chosen.explanation,
      difficulty: 'mittel',
      focus: 'Politische Bildung',
    };
  }

  if (template === 'geschichte') {
    const facts = [
      {
        prompt: 'In welchem Jahrhundert trat Zürich der Eidgenossenschaft bei?',
        answer: '14',
        explanation: 'Zürich trat 1351 (14. Jahrhundert) der Eidgenossenschaft bei.',
      },
      {
        prompt: 'Welcher Reformator prägte Zürich im 16. Jahrhundert maßgeblich?',
        answer: 'Huldrych Zwingli',
        explanation: 'Zwingli leitete die Reformation in Zürich ein.',
      },
    ];
    const chosen = pick(facts);
    if (chosen.answer === '14') {
      return {
        id: randomId(),
        prompt: chosen.prompt,
        type: 'numeric',
        answer: chosen.answer,
        explanation: chosen.explanation,
        difficulty: 'anspruchsvoll',
        focus: 'Geschichte Zürich',
      };
    }
    return {
      id: randomId(),
      prompt: chosen.prompt,
      type: 'multiple-choice',
      options: shuffle(['Huldrych Zwingli', 'Jean Calvin', 'Johann Heinrich Pestalozzi', 'Ulrich Bräker']),
      answer: chosen.answer,
      explanation: chosen.explanation,
      difficulty: 'mittel',
      focus: 'Geschichte Zürich',
    };
  }

  const culture = [
    {
      prompt: 'Welches traditionelle Fest findet jeweils im April in Zürich statt?',
      answer: 'Sechseläuten',
      options: ['Sechseläuten', 'Chalandamarz', 'Eidgenössisches Turnfest', 'Züri Fäscht'],
      explanation: 'Das Sechseläuten mit dem Böögg gehört zum Zürcher Jahreslauf.',
    },
    {
      prompt: 'Wie heißt das renommierte Kunstmuseum im Zentrum von Zürich?',
      answer: 'Kunsthaus Zürich',
      options: ['Kunsthaus Zürich', 'Paul-Klee-Zentrum', 'Fondation Beyeler', 'Museum Rietberg'],
      explanation: 'Das Kunsthaus Zürich beherbergt bedeutende Sammlungen und ist Prüfungsstoff in Kulturfragen.',
    },
  ];
  const chosen = pick(culture);
  return {
    id: randomId(),
    prompt: chosen.prompt,
    type: 'multiple-choice',
    options: shuffle(chosen.options),
    answer: chosen.answer,
    explanation: chosen.explanation,
    difficulty: 'leicht',
    focus: 'Kultur',
  };
};

const topics: Topic[] = [
  {
    id: 'deutsch',
    title: 'Deutschkompetenz',
    tagline: 'Texte analysieren, stilistisch glänzen',
    description: 'Grammatik, Textverständnis und Wortschatz für die Aufnahmeprüfung in Deutsch.',
    focusAreas: ['Grammatik', 'Lesen', 'Argumentation'],
    generate: generateDeutschQuestion,
  },
  {
    id: 'mathe',
    title: 'Mathematik',
    tagline: 'Zahlen sicher meistern',
    description: 'Aufgaben zu Prozentrechnung, Gleichungen, Geometrie und Bruchverständnis.',
    focusAreas: ['Prozent', 'Geometrie', 'Algebra'],
    generate: generateMatheQuestion,
  },
  {
    id: 'logik',
    title: 'Logik & Denken',
    tagline: 'Analysieren, folgern, Muster entdecken',
    description: 'Trainiere Schlussfolgerungen, Reihenfolgen und logische Strukturen.',
    focusAreas: ['Denkmuster', 'Argumentation', 'Strukturierung'],
    generate: generateLogikQuestion,
  },
  {
    id: 'realien',
    title: 'Realien Kanton Zürich',
    tagline: 'Regionale Allgemeinbildung',
    description: 'Geschichte, Geografie und Politik des Kantons Zürich im Blick.',
    focusAreas: ['Politik', 'Geschichte', 'Kultur'],
    generate: generateRealienQuestion,
  },
];

const loadState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveState = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const getXpForQuestion = (difficulty: Question['difficulty']) => {
  switch (difficulty) {
    case 'leicht':
      return 12;
    case 'mittel':
      return 18;
    default:
      return 25;
  }
};

export default function App() {
  const [view, setView] = useState<'landing' | 'session' | 'summary'>('landing');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [feedback, setFeedback] = useState<AnswerRecord | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>(() =>
    loadState<SessionSummary[]>('gla-summaries', [])
  );
  const [xp, setXp] = useState(() => loadState<number>('gla-xp', 0));
  const [streak, setStreak] = useState(() => loadState<number>('gla-streak', 0));
  const qualitySeal = useMemo(() => pick(qualitySeals), [activeTopic, view]);

  useEffect(() => {
    saveState('gla-xp', xp);
  }, [xp]);

  useEffect(() => {
    saveState('gla-streak', streak);
  }, [streak]);

  useEffect(() => {
    saveState('gla-summaries', sessionSummaries);
  }, [sessionSummaries]);

  const level = Math.floor(xp / 120) + 1;
  const badges = badgeThresholds.filter((b) => xp >= b.xp).map((b) => b.label);

  const currentQuestion = questions[currentIndex];

  const startSession = (topic: Topic) => {
    const generated = Array.from({ length: 6 }, () => topic.generate());
    setActiveTopic(topic);
    setQuestions(generated);
    setAnswers([]);
    setCurrentIndex(0);
    setFeedback(null);
    setInputValue('');
    setSelectedOption(null);
    setAnswered(false);
    setView('session');
  };

  const evaluateAnswer = (question: Question, userAnswer: string): boolean => {
    if (question.type === 'numeric') {
      const normalizedInput = Number(userAnswer.replace(',', '.'));
      const normalizedAnswer = Number(question.answer.replace(',', '.'));
      if (Number.isNaN(normalizedInput) || Number.isNaN(normalizedAnswer)) {
        return normalizeText(userAnswer) === normalizeText(question.answer);
      }
      return Math.abs(normalizedInput - normalizedAnswer) < 0.0001;
    }
    return normalizeText(userAnswer) === normalizeText(question.answer);
  };

  const registerAnswer = (value: string) => {
    if (!currentQuestion || answered) return;
    const correct = evaluateAnswer(currentQuestion, value);
    const record: AnswerRecord = {
      question: currentQuestion,
      userAnswer: value,
      correct,
    };
    setFeedback(record);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = record;
      return copy;
    });
    setAnswered(true);
    if (correct) {
      setXp((prev) => prev + getXpForQuestion(currentQuestion.difficulty));
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleSubmitFreeText = () => {
    if (!inputValue.trim()) return;
    registerAnswer(inputValue.trim());
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue('');
      setSelectedOption(null);
      setFeedback(null);
      setAnswered(false);
    } else if (activeTopic) {
      const correctAnswers = answers.filter((a) => a?.correct).length + (feedback?.correct && !answers[currentIndex] ? 1 : 0);
      const summary: SessionSummary = {
        topicId: activeTopic.id,
        topicTitle: activeTopic.title,
        correct: correctAnswers,
        total: questions.length,
        timestamp: new Date().toISOString(),
      };
      setSessionSummaries((prev) => [summary, ...prev].slice(0, 10));
      setView('summary');
    }
  };

  const restart = () => {
    setView('landing');
    setActiveTopic(null);
    setQuestions([]);
    setAnswers([]);
    setFeedback(null);
    setSelectedOption(null);
    setInputValue('');
    setAnswered(false);
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <h1>Vorbereitungs-Campus Zürich</h1>
          <p className="subtitle">Interaktives KI-Training für das Langzeitgymnasium</p>
        </div>
        <div className="profile-badges" aria-label="Nutzerstatistiken">
          <div className="score-chip">XP {xp}</div>
          <div className="score-chip">Level {level}</div>
          <div className="score-chip">Serie {streak}</div>
        </div>
      </header>

      <main className="content-area">
        {view === 'landing' && (
          <section className="landing">
            <div className="hero">
              <div>
                <h2>Starte dein persönliches Prüfungslab</h2>
                <p>
                  Jede Sitzung erzeugt frische Aufgaben mit unserer geprüften KI. Sofortiges Feedback, verständliche
                  Erklärungen und ein Dashboard zeigen deinen Fortschritt in allen relevanten Bereichen.
                </p>
                <div className="quality-seal">{qualitySeal}</div>
              </div>
            </div>
            <div className="topic-grid">
              {topics.map((topic) => (
                <article key={topic.id} className="topic-card">
                  <h3>{topic.title}</h3>
                  <p className="tagline">{topic.tagline}</p>
                  <p>{topic.description}</p>
                  <div className="chips">
                    {topic.focusAreas.map((area) => (
                      <span key={area} className="chip">
                        {area}
                      </span>
                    ))}
                  </div>
                  <button className="primary" onClick={() => startSession(topic)}>
                    KI-Session starten
                  </button>
                </article>
              ))}
            </div>
            {sessionSummaries.length > 0 && (
              <section className="history">
                <h2>Letzte Sessions</h2>
                <ul>
                  {sessionSummaries.map((entry) => (
                    <li key={entry.timestamp}>
                      <span>{entry.topicTitle}</span>
                      <span>
                        {entry.correct}/{entry.total} • {new Date(entry.timestamp).toLocaleDateString('de-CH')} {new Date(entry.timestamp).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>
        )}

        {view === 'session' && activeTopic && currentQuestion && (
          <section className="session-view">
            <div className="session-header">
              <button className="ghost" onClick={restart}>
                ← Auswahl
              </button>
              <div>
                <h2>{activeTopic.title}</h2>
                <p>{activeTopic.tagline}</p>
              </div>
              <div className="progress-info">
                Frage {currentIndex + 1} / {questions.length}
              </div>
            </div>

            <article className="question-card">
              <div className="question-meta">
                <span className={`difficulty ${currentQuestion.difficulty}`}>{currentQuestion.difficulty}</span>
                <span className="focus">{currentQuestion.focus}</span>
              </div>
              <p className="prompt">{currentQuestion.prompt}</p>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="options-grid">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = feedback?.question.id === currentQuestion.id && feedback.correct && option === currentQuestion.answer;
                    const isWrongSelection = feedback?.question.id === currentQuestion.id && !feedback.correct && isSelected;
                    return (
                      <button
                        key={option}
                        className={`option-button ${isSelected ? 'selected' : ''} ${isCorrectOption ? 'correct' : ''} ${isWrongSelection ? 'wrong' : ''}`}
                        onClick={() => {
                          setSelectedOption(option);
                          registerAnswer(option);
                        }}
                        disabled={answered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {(currentQuestion.type === 'free-text' || currentQuestion.type === 'numeric') && (
                <div className="free-input">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Antwort eingeben"
                    disabled={answered}
                    aria-label="Antwortfeld"
                  />
                  <button className="primary" onClick={handleSubmitFreeText} disabled={answered}>
                    Antwort prüfen
                  </button>
                </div>
              )}

              {feedback && feedback.question.id === currentQuestion.id && (
                <div className={`feedback ${feedback.correct ? 'positive' : 'negative'}`}>
                  <p>{feedback.correct ? '✅ Richtig!' : '❌ Nicht ganz.'}</p>
                  <p>
                    Lösung: <strong>{currentQuestion.answer}</strong>
                  </p>
                  <p className="explanation">{currentQuestion.explanation}</p>
                  <button className="secondary" onClick={goToNextQuestion}>
                    {currentIndex === questions.length - 1 ? 'Zur Auswertung' : 'Nächste Frage'}
                  </button>
                </div>
              )}
            </article>

            <aside className="sidebar">
              <div className="quality-seal sticky">{qualitySeal}</div>
              <div className="xp-meter">
                <h3>Fortschritt</h3>
                <p>
                  XP insgesamt: <strong>{xp}</strong>
                </p>
                <p>Aktuelle Serie: {streak}</p>
                <div className="badge-grid">
                  {badgeThresholds.map((badge) => (
                    <div key={badge.label} className={`badge ${xp >= badge.xp ? 'earned' : ''}`}>
                      <span>{badge.label}</span>
                      <small>{badge.xp} XP</small>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}

        {view === 'summary' && activeTopic && (
          <section className="summary-view">
            <div className="summary-card">
              <h2>Auswertung – {activeTopic.title}</h2>
              <p>
                Du hast {answers.filter((a) => a?.correct).length} von {questions.length} Fragen korrekt beantwortet.
              </p>
              <div className="summary-actions">
                <button className="primary" onClick={() => startSession(activeTopic)}>
                  Neue Session generieren
                </button>
                <button className="ghost" onClick={restart}>
                  Zur Themenwahl
                </button>
              </div>
            </div>
            <ul className="answer-breakdown">
              {questions.map((question, index) => {
                const record = answers[index];
                const status = record?.correct ? 'correct' : 'wrong';
                return (
                  <li key={question.id} className={status}>
                    <div>
                      <h3>Frage {index + 1}</h3>
                      <p className="prompt">{question.prompt}</p>
                    </div>
                    <div className="answer-info">
                      <span className="status">{record?.correct ? 'Richtig' : 'Falsch'}</span>
                      <span className="solution">Lösung: {question.answer}</span>
                      <span className="user">Deine Antwort: {record?.userAnswer ?? '—'}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            {badges.length > 0 && (
              <div className="earned-badges">
                <h3>Verdiente Badges</h3>
                <div className="badge-grid">
                  {badges.map((badge) => (
                    <div key={badge} className="badge earned">
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
