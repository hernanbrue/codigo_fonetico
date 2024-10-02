const alphabetQ = {
  'A': 'Alfa',
  'B': 'Bravo',
  'C': 'Charlie',
  'D': 'Delta',
  'E': 'Eco',
  'F': 'Foxtrot',
  'G': 'Golf',
  'H': 'Hotel',
  'I': 'India',
  'J': 'Juliet',
  'K': 'Kilo',
  'L': 'Lima',
  'M': 'Mike',
  'N': 'November',
  'O': 'Oscar',
  'P': 'Papa',
  'Q': 'Quebec',
  'R': 'Romeo',
  'S': 'Sierra',
  'T': 'Tango',
  'U': 'Uniform',
  'V': 'Victor',
  'W': 'Wiskey',
  'X': 'Xray',
  'Y': 'Yankee',
  'Z': 'Zulu',
  'Á': 'Alfa',   // A acentuada
  'É': 'Eco',    // E acentuada
  'Í': 'India',  // I acentuada
  'Ó': 'Oscar',  // O acentuada
  'Ú': 'Uniform' // U acentuada
};

let streak = 0;
let currentWord = "";
let words = [];

// Función para obtener una palabra aleatoria
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Función para cargar las palabras desde el archivo JSON
function loadWords() {
  fetch('spanish_words.json')
    .then(response => response.json())
    .then(data => {
      words = data.words.filter(word => !word.includes('ñ') && !word.includes('Ñ'));
      currentWord = getRandomWord();
      updateUI();
    })
    .catch(error => {
      console.error("Error al cargar el archivo de palabras:", error);
    });
}

function codifyWord(word) {
  let translation = "";
  for (let letter of word.toUpperCase()) {
    if (alphabetQ[letter]) {
      translation += alphabetQ[letter] + " "; 
    }
  }
  return translation.trim();
}

function normalizeInput(input) {
  return input
    .replace(/_/g, " ")      
    .trim()                  
    .toLowerCase();          
}

function compareAnswers(userTranslation, correctTranslation) {
  const userWords = userTranslation.split(" ").sort();
  const correctWords = correctTranslation.split(" ").sort();
  return JSON.stringify(userWords) === JSON.stringify(correctWords);
}

function updateUI() {
  document.getElementById('random-word').textContent = currentWord;
  document.getElementById('user-input').value = "";
  document.getElementById('result').textContent = "";
}

function showDictionary() {
  const list = document.getElementById('alphabet-list');
  list.innerHTML = "";
  for (let letter in alphabetQ) {
    const listItem = document.createElement('li');
    listItem.textContent = `${letter}: ${alphabetQ[letter]}`;
    list.appendChild(listItem);
  }
  document.getElementById('dictionary').classList.remove('hidden');
}

function hideDictionary() {
  document.getElementById('dictionary').classList.add('hidden');
}

document.getElementById('submit-btn').addEventListener('click', () => {
  const userTranslation = normalizeInput(document.getElementById('user-input').value);
  const correctTranslation = normalizeInput(codifyWord(currentWord));

  if (compareAnswers(userTranslation, correctTranslation)) {
    streak++;
    document.getElementById('result').textContent = "¡Correcto!";
    document.getElementById('streak').textContent = `Streak actual: ${streak}`;
  } else {
    document.getElementById('result').textContent = `Incorrecto. La traducción correcta era: ${correctTranslation}`;
    document.getElementById('streak').textContent = `Tu streak se ha reiniciado.`;
    streak = 0;
  }
});

document.getElementById('hint-btn').addEventListener('click', showDictionary);
document.getElementById('close-dictionary').addEventListener('click', hideDictionary);

document.getElementById('play-again').addEventListener('click', () => {
  currentWord = getRandomWord();
  updateUI();
});

// Inicializar el juego
loadWords();
