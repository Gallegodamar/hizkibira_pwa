

export const NUM_QUESTIONS_TO_GENERATE = 5;

export const LOCALSTORAGE_QUESTIONS_KEY = 'dailySynonymGame_data_v9'; // Bertsioa eguneratuta data gehitzeagatik
export const SCORE_TO_PASS_LEVEL = 3; // Hau mantentzen da, baina maila kontzeptua ez dago aktibo orokorrean

// Nuevas constantes de puntuación
export const SCORE_CORRECT_ANSWER = 10;

export const BONUS_TIME_UNDER_5_SEC = 5;
export const BONUS_TIME_BETWEEN_5_AND_10_SEC = 3; // Cambiado para reflejar el nombre correctamente

export const TIME_THRESHOLD_5_SEC_MS = 5000; // 5 segundos en milisegundos
export const TIME_THRESHOLD_10_SEC_MS = 10000; // 10 segundos en milisegundos

export const STREAK_BONUS_3_CORRECT = 5;
export const STREAK_BONUS_5_CORRECT = 10;

export const STREAK_THRESHOLD_3 = 3;
export const STREAK_THRESHOLD_5 = 5;

// Constante de duración máxima de la pregunta (para la barra de tiempo y auto-sumisión)
export const MAX_QUESTION_DURATION_MS = 15000; // 15 segundos para cada pregunta

// Hora de reinicio diario de las preguntas (formato 24h, hora local)
export const DAILY_RESET_HOUR = 8; // 8 AM

// Constantes eliminadas (ya no se usan con el nuevo sistema):
// export const MAX_TOTAL_GAME_SCORE = 100;
// export const BASE_SCORE_CORRECT_ANSWER = parseFloat(rawBaseScore.toFixed(2));
// export const PERFECT_TIME_THRESHOLD_MS = 1000;
// export const PENALTY_PER_INTERVAL = parseFloat(rawPenalty.toFixed(2));
// export const MS_PER_PENALTY_INTERVAL = 100;