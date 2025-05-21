import React, { useEffect, useRef, useState } from 'react';
import * as Vex from 'vexflow';
import * as Tone from 'tone';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const App = () => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef(null);
  const [notes, setNotes] = useState([
    new Vex.Flow.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),
    new Vex.Flow.StaveNote({ clef: 'treble', keys: ['d/4'], duration: 'q' }),
    new Vex.Flow.StaveNote({ clef: 'treble', keys: ['e/4'], duration: 'q' }),
    new Vex.Flow.StaveNote({ clef: 'treble', keys: ['f/4'], duration: 'q' }),
  ]);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(canvasRef.current, VF.Renderer.Backends.CANVAS);
    renderer.resize(500, 200);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 400);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);

    // Fetch lesson from backend
    axios.get('https://profesor-de-ritmo-backend.onrender.com/lesson/beginner/es')
      .then(response => setLesson(response.data))
      .catch(error => console.error('Error fetching lesson:', error));
  }, [notes]);

  const addNote = (key) => {
    const newNote = new Vex.Flow.StaveNote({ clef: 'treble', keys: [key], duration: 'q' });
    setNotes([...notes, newNote].slice(-4));
  };

  const playNotes = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    notes.forEach((note, index) => {
      const key = note.keys[0].split('/')[0].toUpperCase() + '4';
      synth.triggerAttackRelease(key, '4n', now + index * 0.5);
    });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    axios.get(`https://profesor-de-ritmo-backend.onrender.com/lesson/beginner/${lng}`)
      .then(response => setLesson(response.data))
      .catch(error => console.error('Error fetching lesson:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <div className="mb-4">
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('es')}>
          Español
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('he')}>
          Hebreo
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('en')}>
          Inglés
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('pt')}>
          Português
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('fr')}>
          Français
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('it')}>
          Italiano
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('ja')}>
          日本語
        </button>
        <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={() => changeLanguage('ko')}>
          한국어
        </button>
      </div>
      <canvas ref={canvasRef} className="border border-gray-300 mb-4"></canvas>
      <div className="mb-4">
        <button className="mx-2 p-2 bg-green-500 text-white rounded" onClick={() => addNote('c/4')}>
          Add C4
        </button>
        <button className="mx-2 p-2 bg-green-500 text-white rounded" onClick={() => addNote('d/4')}>
          Add D4
        </button>
        <button className="mx-2 p-2 bg-green-500 text-white rounded" onClick={() => addNote('e/4')}>
          Add E4
        </button>
        <button className="mx-2 p-2 bg-green-500 text-white rounded" onClick={() => addNote('f/4')}>
          Add F4
        </button>
        <button className="mx-2 p-2 bg-purple-500 text-white rounded" onClick={playNotes}>
          Play Notes
        </button>
      </div>
      {lesson && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">{t('theory')}</h2>
          <p>{lesson.theory.question}</p>
          <ul>
            {lesson.theory.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4">{t('description')}</p>
      <a href="https://paypal.me/profesorderitmo" className="mt-4 p-2 bg-green-500 text-white rounded">
        {t('donate')}
      </a>
    </div>
  );
};

export default App;
