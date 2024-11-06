// DOM-elementer
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const balanceDisplay = document.getElementById('balance');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
    document.getElementById('reel4'),
    document.getElementById('reel5')
];

// Symboler og vekting for spilleautomaten
const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀', '💎', '💣'];
const symbolWeights = {
    '🍒': 4, '🍋': 3, '🍊': 2, '🍉': 1.8,
    '⭐': 0.8, '🍀': 1.2, '💎': 0.3, '💣': 0.7
};

// Gevinstmultiplikator for antall like symboler
const winMultipliers = {
    '🍒': [0, 0, 15, 30, 60],
    '🍋': [0, 0, 25, 50, 100],
    '🍊': [0, 0, 35, 70, 150],
    '🍉': [0, 0, 50, 100, 200],
    '⭐': [0, 10, 50, 100, 200],
    '💎': [0, 30, 100, 250, 500],
    '🍀': [0, 5, 75, 150, 300],
    '💣': [0] // Ingen gevinst for bomben
};

// Startbalanse og lånebeløp
let balance = 40;  // Startbalanse
let loan = 0;  // Lånebeløp

// Oppdater balansen i visningen
function updateBalanceDisplay() {
    balanceDisplay.textContent = `Balanse: ${balance} kr`;
}

// Tilfeldig symbolgenerator basert på vekting
function getRandomSymbol() {
    const weightedSymbols = Object.keys(symbolWeights).flatMap(
        symbol => Array(symbolWeights[symbol] * 10).fill(symbol)
    );
    return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
}

// Sjekk gevinst og håndter bomben separat
function checkWin(results) {
    let winAmount = 0;
    let symbolCounts = {};  // Objekt for å telle antall av hvert symbol

    // Hvis vi får en bombe på noen hjul, trekker vi penger og stopper videre behandling
    if (results.includes('💣')) {
        winAmount -= 150;  // Tapte 150 kr ved bombe
        resultDisplay.textContent = `💣 Bombe! Du mistet 150 kr!`;
    } else {
        // Tell antall forekomster av hvert symbol
        results.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });

        // Beregn gevinsten basert på antall like symboler
        Object.keys(symbolCounts).forEach(symbol => {
            const count = symbolCounts[symbol];
            // Unngå å beregne gevinst for bomben (💣)
            if (symbol !== '💣' && count > 0) {
                const multiplier = winMultipliers[symbol][count]; // Hent multiplikatoren for antall like symboler
                if (multiplier && typeof multiplier === 'number') {
                    winAmount += multiplier; // Legg til gyldig multiplikator
                }
            }
        });

        // Hvis ingen gevinster, vis en melding
        if (winAmount > 0) {
            resultDisplay.textContent = `Gratulerer! Du vant ${winAmount} kr!`;
        } else {
            resultDisplay.textContent = "Ingen gevinst denne gangen.";
        }
    }

    // Oppdater balansen etter at gevinster og eventuelle tap (bomben) er beregnet
    balance += winAmount;

    // Sørg for at balansen aldri går under 0
    if (balance < 0) balance = 0;

    // Oppdater balansen på skjermen
    updateBalanceDisplay();
}

// Spin-logikken
function spinReels() {
    if (balance < 5) {  // Minimum 5 kr for spinn
        resultDisplay.textContent = "Ikke nok penger til å spinne!";
        return;
    }

    balance -= 5;
    updateBalanceDisplay();
    resultDisplay.textContent = "Spinning...";

    reels.forEach(reel => reel.classList.add('spin'));

    setTimeout(() => {
        const spinResults = reels.map(reel => {
            const symbol = getRandomSymbol();
            reel.textContent = symbol;
            reel.classList.remove('spin');
            return symbol;
        });

        checkWin(spinResults);
    }, 500);
}

// Start spillet
updateBalanceDisplay();
spinButton.addEventListener('click', spinReels);
