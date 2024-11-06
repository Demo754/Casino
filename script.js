const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];

// Symboler for spilleautomaten  
const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀'];
let balance = 10; // Startbalanse

function spinReels() {
    // Legg til "spin" klassen for animasjon  
    reels.forEach(reel => {
        reel.classList.add('spin');
    });

    // Vent på animasjonen før du spinner hjulene  
    setTimeout(() => {
        for (let i = 0; i < reels.length; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            reels[i].textContent = symbols[randomIndex];
            // Fjern "spin" klassen etter spinning  
            reels[i].classList.remove('spin');
        }
        checkWin();
    }, 500); // Vent i 500 ms for å la animasjonen spille av  
}

function checkWin() {
    const firstSymbol = reels[0].textContent;
    const secondSymbol = reels[1].textContent;
    const thirdSymbol = reels[2].textContent;

    let winAmount = 0;

    // Sjekk for tre like symboler  
    if (firstSymbol === secondSymbol && secondSymbol === thirdSymbol) {
        winAmount += 3; // Gi 3 kroner for tre like  
    } 
    // Sjekk for to like symboler  
    else if (firstSymbol === secondSymbol || firstSymbol === thirdSymbol || secondSymbol === thirdSymbol) {
        winAmount += 2; // Gi 1 krone for to like  
    }

    // Hvis ingen kombinasjoner, trekk 1 krone  
    if (winAmount === 0) {
        winAmount -= 1; // Trekk 1 krone  
    }

    // Oppdater balansen  
    balance += winAmount;

    // Oppdater resultatvisning  
    if (winAmount > 0) {
        resultDisplay.textContent = `Gratulerer! Du vant ${winAmount} kr! Ny balanse: ${balance} kr.`;
    } else {
        resultDisplay.textContent = `Du tapte 1 krone. Balanse: ${balance} kr.`;
    }
}

// Legg til event listener for knappen  
spinButton.addEventListener('click', spinReels);