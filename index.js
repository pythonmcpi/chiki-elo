const UPGRADES = `
Nothing
Shield
Feather
Yellow Balloon
Diamond
Stardust
Reusable Bag
Party Popper
Shears
Treasure Chest
Golden Apple
Cloud
Binoculars
Apple Seeds
Fastball
Magnet
Candle
Double AA Batteries
Coin Bag
Mushrooms
Hourglass
Pickaxe
Map
Bubble
Rocket
Piggy Bank
Lifesaver
Blast Boots
Solar Ring (Chiki)
Lunar Ring (Chiki)
Solar Ring (Ronnie)
Lunar Ring (Ronnie)
Solar Ring (Pickle)
Lunar Ring (Pickle)
Solar Ring (Skips)
Lunar Ring (Skips)
`
    .split("\n")
    .filter((u) => u.length > 0);

const RANKS = new Map();

// Start at 1000 ELO
for (const upgr of UPGRADES) {
    RANKS.set(upgr, 1000);
}

// Based on u/spryes's implementation
// https://codepen.io/anon/pen/ZKKPyv?editors=0010
const KFactor = 32;

function chanceOfWin(selfRating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - selfRating) / 400));
}

function updateElo(winner, loser) {
    const winnerChance = chanceOfWin(RANKS.get(winner), RANKS.get(loser));
    const loserChance = chanceOfWin(RANKS.get(loser), RANKS.get(winner));

    RANKS.set(winner, RANKS.get(winner) + KFactor * (1 - winnerChance));
    RANKS.set(loser, RANKS.get(loser) + KFactor * (0 - loserChance));
}

function pickFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let currentPair;

const header = document.createElement("h1");
header.innerText = "Chiki's Chase Upgrade ELO Ranker";
document.body.appendChild(header);

const buttonA = document.createElement("button");
const buttonB = document.createElement("button");

document.body.appendChild(buttonA);
document.body.appendChild(buttonB);

const currentRankList = document.createElement("ol");
document.body.appendChild(currentRankList);

function newPair() {
    const a = pickFromArray(UPGRADES);
    const b = pickFromArray(UPGRADES.filter((u) => u != a));

    currentPair = [a, b];
    buttonA.innerText = a;
    buttonB.innerText = b;
}

function updateList() {
    // Clear entries
    currentRankList.innerHTML = "";

    const sorted = [...RANKS.entries()].sort((a, b) => a[1] - b[1]).reverse();

    for (const [upgr, score] of sorted) {
        const li = document.createElement("li");
        li.innerText = `${upgr} - ${Math.floor(score)}`;
        currentRankList.appendChild(li);
    }
}

buttonA.addEventListener("click", () => {
    updateElo(currentPair[0], currentPair[1]);
    newPair();
    updateList();
});

buttonB.addEventListener("click", () => {
    updateElo(currentPair[1], currentPair[0]);
    newPair();
    updateList();
});

newPair();
updateList();
