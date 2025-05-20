from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import music21
import numpy as np
import librosa
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_theory_exercise(level):
    if level == 'beginner':
        return {
            'type': 'theory',
            'question': '¿Qué es una nota musical?',
            'answer': 'Una nota musical es un sonido con una altura y duración específicas.',
            'options': ['Un ritmo', 'Un sonido con altura', 'Un instrumento', 'Un compás']
        }
    return {}

def generate_solfege_exercise():
    stream = music21.stream.Stream()
    stream.append(music21.note.Note('C4', quarterLength=1))
    stream.append(music21.note.Note('D4', quarterLength=1))
    stream.append(music21.note.Note('E4', quarterLength=1))
    stream.write('midi', 'exercise.mid')
    return {'type': 'solfege', 'file': 'exercise.mid', 'task': 'Canta las notas en orden.'}

def analyze_audio(audio_file):
    y, sr = librosa.load(audio_file)
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    return {'instruments': ['piano'], 'confidence': 0.8}

def generate_lesson(level, language='es'):
    lesson = {
        'theory': generate_theory_exercise(level),
        'solfege': generate_solfege_exercise(),
        'harmony': {'task': 'Identifica el acorde C mayor'},
        'rhythmic_dictation': {'task': 'Escribe el ritmo de 4/4'},
        'melodic_dictation': {'task': 'Escribe la melodía en C mayor'}
    }
    return lesson

@app.get("/lesson/{level}/{language}")
async def get_lesson(level: str, language: str):
    lesson = generate_lesson(level, language)
    return lesson

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
