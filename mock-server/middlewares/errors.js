// Simulate server side errors
exports.error = (req, res, next) => {
  const randomOutcome = Math.random();
  if (randomOutcome < 0.05 && !req.path.startsWith('/api/')) {
    const choice = Math.random();

    if (choice < 0.11) {
      return res.status(400).jsonp({
        error: 'Bad Request',
      });
    } else if (choice < 0.22) {
      return res.status(401).jsonp({
        error: 'Unauthorized',
      });
    } else if (choice < 0.33) {
      return res.status(403).jsonp({
        error: 'Forbidden',
      });
    } else if (choice < 0.44) {
      return res.status(404).jsonp({
        error: 'Not Found',
      });
    } else if (choice < 0.55) {
      return res.status(410).jsonp({
        error: 'Gone',
      });
    } else if (choice < 0.66) {
      return res.status(500).jsonp({
        error: 'Internal Server Error',
      });
    } else if (choice < 0.77) {
      return res.status(501).jsonp({
        error: 'Not Implemented',
      });
    } else if (choice < 0.88) {
      return res.status(503).jsonp({
        error: 'Service Unavailable',
      });
    } else {
      return res.status(550).jsonp({
        error: 'Permission denied',
      });
    }
  } else {
    // Continue to JSON Server router
    next();
  }
};
