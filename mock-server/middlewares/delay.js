// Simulate server side delay
exports.delay = (req, res, next) => {
  const randomOutcome = Math.random();
  if (randomOutcome < 0.01) {
    setTimeout(next, Math.floor((Math.random() * 8000) + 100));
  } else {
    next();
  }
};
