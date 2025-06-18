/* ---------- ELEMENTOS DOM PRINCIPAIS ---------- */
const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const KeyboardDiv = document.querySelector(".keyboard");
const AccentDiv = document.querySelector(".accent");
const gameModal = document.querySelector(".game-modal");
const playGame = document.querySelector(".play-again");
const containerJogo = document.querySelector(".container")
const categoryButtons = document.querySelectorAll(".category-buttons button");
const startBtn = document.getElementById("start-btn");
const menuOla = document.querySelector(".textoInicial")
// Junta todas as palavras de todas as categorias
const allWords = Object.values(wordCategories).flat();
// Adiciona a categoria "Aleatório" ao objeto original
wordCategories["Aleatorio"] = allWords;

let selectedCategory = null;         // 🠒 definida ao clicar num botão
let currentWord, correctLetters = [], wrongGuessCount = 0;
const maxGuessed = 6;

/* ---------- FUNÇÕES DE JOGO ---------- */

const randomNumber = (min, max)=>{
    return Math.round(Math.random() * (max - min) + min )
}

const getRandomColor = ()=>{
    const red = randomNumber(0, 120)
    const green = randomNumber(0, 100)
    const blue = randomNumber(80, 255)
    return `rgb(${red}, ${green}, ${blue})`
}

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount}/${maxGuessed}`;
    KeyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    AccentDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() =>
        `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const list = wordCategories[selectedCategory];
    const { word, hint } = list[Math.floor(Math.random() * list.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
};

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? "Você acertou a palavra:" : "A palavra correta era:";
        gameModal.querySelector("img").src = `images/${isVictory ? "victory" : "lost"}.gif`;
        gameModal.querySelector("h4").innerText = isVictory ? "Parabéns!" : "Fim de jogo!";
        gameModal.querySelector("p").innerHTML = `${modalText} <strong>${currentWord}</strong>`;
        gameModal.classList.add("show");
    }, 200);
};

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, i) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                const li = wordDisplay.querySelectorAll("li")[i];
                li.innerText = letter;
                li.classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount}/${maxGuessed}`;

    const allGuessed = [...wordDisplay.querySelectorAll("li")].every(li => li.classList.contains("guessed"));
    if (allGuessed) return gameOver(true);
    if (wrongGuessCount === maxGuessed) return gameOver(false);
};


/* ---------- CRIAÇÃO DO TECLADO NORMAL (a-z) ---------- */
for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.innerText = letter;
    btn.style.backgroundColor = getRandomColor()
    KeyboardDiv.appendChild(btn);
    btn.addEventListener("pointerdown", e => initGame(e.target, letter));
}

/* ---------- CRIAÇÃO DO TECLADO COM ACENTOS ---------- */
const accentedLetters = ["á", "é", "í", "ó", "ú", "â", "ê", "ô", "ã", "õ", "ç", "-", " "];

accentedLetters.forEach(letter => {
    const btn = document.createElement("button");
    btn.innerText = letter;
    btn.style.backgroundColor = getRandomColor()
    AccentDiv.appendChild(btn);
    btn.addEventListener("pointerdown", e => initGame(e.target, letter));
});

/* ---------- EVENTOS DOS BOTÕES DE CATEGORIA ---------- */
categoryButtons.forEach(btn => {
    btn.addEventListener("pointerdown", () => {
        // visual "ativo"
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        selectedCategory = btn.dataset.category;
        startBtn.style.display = "inline-block";   // mostra botão iniciar
    });
});


/* ---------- BOTÃO COMEÇAR JOGO ---------- */
startBtn.addEventListener("pointerdown", () => {
    getRandomWord();
    startBtn.style.display = "none";
    containerJogo.style.display = "flex"
    menuOla.style.display = "none";
    menuOla.style.display = "flex";
    menuOla.innerHTML = "<p>Escolha outra categoria</p>";
});

/* ---------- BOTÃO JOGAR NOVAMENTE ---------- */
playGame.addEventListener("pointerdown", () => {
    getRandomWord();          // mesma categoria escolhida
    gameModal.classList.remove("show");
});

