import React, { useEffect, useRef } from 'react';
import * as Vex from 'vexflow';
import * as Tone from 'tone';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef(null);

  useEffect(() => {
    // Inicializar VexFlow para renderizar partituras
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(canvasRef.current, VF.Renderer.Backends.CANVAS);
    renderer.resize(500, 200);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 400);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    // Ejemplo de notas
    const notes = [
      new VF.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),
      new VF.StaveNote({ clef: 'treble', keys: ['d/4'], duration: 'q' }),
      new VF.StaveNote({ clef: 'treble', keys: ['e/4'], duration: 'q' }),
      new VF.StaveNote({ clef: 'treble', keys: ['f/4'], duration: 'q' }),
    ];
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);

    // Reproducir notas con Tone.js
    const synth = new Tone.Synth().toDestination();
    const playNotes = async () => {
      await Tone.start();
      const now = Tone.now();
      synth.triggerAttackRelease('C4', '4n', now);
      synth.triggerAttackRelease('D4', '4n', now + 0.5);
      synth.triggerAttackRelease('E4', '4n', now + 1);
      synth.triggerAttackRelease('F4', '4n', now + 1.5);
    };
    playNotes();
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
      </div>
      <canvas ref={canvasRef} className="border border-gray-300"></canvas>
      <p className="mt-4">{t('description')}</p>
      <a href="https://paypal.me/profesorderitmo" className="mt-4 p-2 bg-green-500 text-white rounded">
        {t('donate')}
      </a>
    </div>
  );
};

export default App;
