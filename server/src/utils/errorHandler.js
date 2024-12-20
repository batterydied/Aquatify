export const handleGlobalError = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send({ error: 'Internal Server Error' });
  };