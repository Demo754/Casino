// DOM-elementer
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const balanceDisplay = document.getElementById('balance');
const loanStatus = document.getElementById('loanStatus');
const spinCountdownDisplay = document.getElementById('spinCountdown');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
    document.getElementById('reel4'),
    document.getElementById('reel5'),
];

// Symboler og vekting for spilleautomaten
const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀', '💎', '💣', '🦹'];  // '🦹' representerer tyven
const symbolWeights = {
    '🍒': 5, '🍋': 4, '🍊': 2, '🍉': 1.8,
    '⭐': 0.8, '🍀': 1.2, '💎': 0.4, '💣': 0.8, '🦹': 1.5
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
    '💣': [0],    // Ingen gevinst for bomben
    '🦹': [0]     // Ingen gevinst for tyven
};

// Startbalanse og lånebeløp
let balance = 100;  // Startbalanse
let loan = 0;       // Lånebeløp
let spinsLeftToPay = -1;  // Antall spinn før lånet forfaller

// Oppdater balanse og andre visninger
function updateDisplays() {
    balanceDisplay.textContent = `Balanse: ${balance} kr`;
    loanStatus.textContent = `Lånesaldo: ${loan} kr`;
    spinCountdownDisplay.textContent = `Spinn igjen før tilbakebetaling: ${spinsLeftToPay > 0 ? spinsLeftToPay : '-'}`;
}

// Lånefunksjon
function takeLoan() {
    if (loan > 0) {
        resultDisplay.textContent = 'Du har allerede et lån!';
        return;
    }
    loan = 50;
    balance += loan;
    spinsLeftToPay = 10;  // Antall spinn før lånet må betales
    resultDisplay.textContent = 'Du tok et lån på 50 kr!';
    updateDisplays();
}

// Betale lån
function payLoan() {
    if (loan === 0) {
        resultDisplay.textContent = 'Du har ingen lån å betale.';
        return;
    }
    if (balance >= loan) {
        balance -= loan;
        loan = 0;
        spinsLeftToPay = -1;
        resultDisplay.textContent = 'Lånet ditt er betalt tilbake!';
    } else {
        resultDisplay.textContent = 'Ikke nok balanse til å betale lånet.';
    }
    updateDisplays();
}

// Tilfeldig symbolgenerator basert på vekting
function getRandomSymbol() {
    const weightedSymbols = Object.keys(symbolWeights).flatMap(
        symbol => Array(symbolWeights[symbol] * 10).fill(symbol)
    );
    return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
}

// Sjekk gevinst og håndter tyven og bomben separat
function checkWin(results) {
    let winAmount = 0;
    let symbolCounts = {};  // Objekt for å telle antall av hvert symbol

    // Hvis vi får en bombe eller tyv på noen hjul, mister vi penger
    if (results.includes('💣')) {
        winAmount -= 150;  // Tapte 150 kr ved bombe
        resultDisplay.textContent = `💣 Bombe! Du mistet 150 kr!`;
    } else if (results.includes('🦹')) {
        winAmount = 0; // Nullstill gevinsten hvis tyven dukker opp
        resultDisplay.textContent = `🦹 Tyven stjeler gevinsten din!`;
    } else {
        // Tell antall forekomster av hvert symbol
        results.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });

        // Beregn gevinsten basert på antall like symboler
        Object.keys(symbolCounts).forEach(symbol => {
            const count = symbolCounts[symbol];
            // Unngå å beregne gevinst for bomben (💣) og tyven (🦹)
            if (symbol !== '💣' && symbol !== '🦹' && count > 1) {
                const multiplier = winMultipliers[symbol][count];
                if (multiplier) {
                    winAmount += multiplier;
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

    // Reduser antall spinn til lånet må betales
    if (spinsLeftToPay > 0) {
        spinsLeftToPay -= 1;
        if (spinsLeftToPay === 0 && loan > 0) {
            resultDisplay.textContent = 'Du klarte ikke å betale lånet i tide. Du taper!';
            balance = 0;
            loan = 0;
        }
    }

    // Oppdater balansen etter at gevinster og eventuelle tap (bomben) er beregnet
    balance += winAmount;
    if (balance < 0) balance = 0;  // Sørg for at balansen aldri går under 0
    updateDisplays();
}

// Spin-logikken
function spinReels() {
    if (balance < 5) {  // Minimum 5 kr for spinn
        resultDisplay.textContent = "Huset vinner alltid!";
        return;
    }

    balance -= 5;
    updateDisplays();
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
updateDisplays();
spinButton.addEventListener('click', spinReels);
loanButton.addEventListener('click', takeLoan);
payLoanButton.addEventListener('click', payLoan);
