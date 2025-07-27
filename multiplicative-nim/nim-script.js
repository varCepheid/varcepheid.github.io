const parameters = {
  classicMode: true,
  maxEntry: 9,
  target: 1000,
  misere: false,
  hardMode: false,
};
let product = 1;
let entries = [];
let gameOver = false;

/** Set the parameters and display the playing space. */
const start = () => {
  if (parameters.classicMode) {
    parameters.maxEntry = 9;
    parameters.target = 1000;
    parameters.misere = false;
    parameters.hardMode = false;
  } else {
    parameters.maxEntry = document.getElementById('max-entry').value;
    parameters.target = document.getElementById('target').value;
  }

  document.getElementById(
    'target-display'
  ).textContent = `Target: ${parameters.target}`;

  document.getElementById('starter').style.display = 'none';
  document.getElementById('play-space').style.display = 'block';

  gameOver = false;
};

/** Called when the user submits an entry. */
const handleEntry = () => {
  // clear previous error
  createError('');

  // check that submission is valid and submit it
  for (let i = 0; i < 1; i++) {
    const entry = parseInt(document.getElementById('entry-box').value);
    if (entry == NaN) {
      createError('Entries must be positive integers.');
      break;
    }
    if (entry < 2 || entry > parameters.maxEntry) {
      createError(`Entries must be between 2 and ${parameters.maxEntry}.`);
      break;
    }
    handleNumber(entry);

    // create computer response if player didn't win
    if (!gameOver) {
      if (parameters.hardMode) {
        // Misere is the same as regular, except the real target is half of the given target.
        if (parameters.misere) {
          handleNumber(
            product < parameters.target / 2
              ? calcEntry(parameters.target / 2)
              : 2
          );
        } else {
          handleNumber(calcEntry(parameters.target));
        }
      } else {
        const oppEntry =
          Math.floor(Math.random() * (parameters.maxEntry - 1)) + 2;
        handleNumber(oppEntry);
      }
    }
  }

  // clear entry box
  document.getElementById('entry-box').value = '';
};

/** Updates product total and entry list for each number submitted by the user or the computer. */
const handleNumber = (number) => {
  entries.push(number);
  updateEntries();

  product *= number;
  updateProduct();
};

/** Update the displayed product total, and check if the target value has been reached. */
const updateProduct = () => {
  if (product >= parameters.target) {
    handleWin();
  }
  document.getElementById('product-display').textContent = product;
};

/** Update the displayed list of submitted numbers. */
const updateEntries = () => {
  let entryList = '';
  entries.forEach((entry) => {
    entryList = `${entryList} ${entry.toString()}`;
  });
  document.getElementById('entry-list').textContent = entryList;
};

const calcEntry = (target) => {
  const max = parameters.maxEntry;
  const lastTarget = Math.ceil(target / (2 * max));
  if (product < lastTarget) {
    return calcEntry(lastTarget);
  }

  const winThreshold = Math.ceil(target / max);
  if (product >= winThreshold) {
    return Math.min(Math.floor(((target - 1) * 2) / product), max);
  } else {
    return Math.floor(Math.random() * (max - 1)) + 2;
  }
};

/** Reset the entire game. */
const reset = () => {
  product = 1;
  entries = [];
  updateProduct();
  updateEntries();

  document.getElementById('end-message').style.display = 'none';
  document.getElementById('entry-box').style.display = 'inline';
  document.getElementById('submitter').style.display = 'inline';
  document.getElementById('entry-box').value = '';

  start();
};

/** Set the text of the error-message element. */
const createError = (message) => {
  document.getElementById('error-text').textContent = message;
};

/** Figure out who won, display an end message, and hide the entry box. */
const handleWin = () => {
  if (!gameOver) {
    const userWin = entries.length % 2;
    const element = document.getElementById('end-message');
    if (userWin === 1) {
      element.textContent = 'Congratulations, you won!';
      element.style.color = 'green';
    } else {
      element.textContent = `Sorry, the computer beat you to ${parameters.target}.`;
      element.style.color = 'red';
    }
    element.style.display = 'block';
    gameOver = true;
  }

  document.getElementById('entry-box').style.display = 'none';
  document.getElementById('submitter').style.display = 'none';
};

/** Toggle the win condition. */
const switchWinType = () => {
  parameters.misere = !parameters.misere;
  if (parameters.misere) {
    document.getElementById('win-type-message').textContent =
      'Misere -- You lose if you exceed the target value.';
    document.getElementById('win-type-switcher').value = 'Switch to Regular';
  } else {
    document.getElementById('win-type-message').textContent =
      'Regular -- You win if you exceed the target value.';
    document.getElementById('win-type-switcher').value = 'Switch to Misere';
  }
};

/** Toggle the computer-selection mode. */
const switchComputerMode = () => {
  parameters.hardMode = !parameters.hardMode;
  if (parameters.hardMode) {
    document.getElementById('computer-mode-message').textContent =
      'Hard -- The computer chooses values optimally.';
    document.getElementById('computer-mode-switcher').value =
      'Switch to Easy Mode';
  } else {
    document.getElementById('computer-mode-message').textContent =
      'Easy -- The computer chooses values randomly.';
    document.getElementById('computer-mode-switcher').value =
      'Switch to Hard Mode';
  }
};

/** Toggle the parameter setup. */
const switchParameterSetup = () => {
  parameters.classicMode = !parameters.classicMode;
  if (parameters.classicMode) {
    document.getElementById('parameters').style.display = 'none';
    document.getElementById('parameter-mode-message').textContent =
      'Playing Classic Mode';
    document.getElementById('parameter-mode-switcher').value =
      'Set Custom Parameters';
    document.getElementById('parameter-mode-notes').textContent =
      'Switching to custom parameters will reset the game.';

    reset();
  } else {
    document.getElementById('parameters').style.display = 'block';
    document.getElementById('parameter-mode-message').textContent =
      'Playing With Custom Parameters';
    document.getElementById('parameter-mode-switcher').value =
      'Back to Classic';
    document.getElementById('parameter-mode-notes').textContent =
      'Switching to Classic will reset the game. Click Apply Changes to reset the game with your new parameters.';
    reset();
  }
};

/** Randomize the maximum entry. */
const randomizeMax = () => {
  const newMax = Math.floor(Math.random() * 23) + 3; // ranges 3 to 25
  parameters.maxEntry = newMax;
  document.getElementById('max-entry').value = newMax;
};

/** Randomize the maximum entry. */
const randomizeTarget = () => {
  // ranges 10 to 1 million, two sig figs
  const value = Math.floor(Math.random() * 91) + 10; // ranges 10 to 100
  const magnitude = Math.floor(Math.random() * 5); // ranges 0 to 4
  const newTarget = value * Math.pow(10, magnitude);
  parameters.target = newTarget;
  document.getElementById('target').value = newTarget;
};
