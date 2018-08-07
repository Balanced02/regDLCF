import app from "./app";

const {
  PORT = 1337, NODE_ENV
} = process.env;
app.listen(PORT, () =>
  console.log(`WiwaHub Server Listening on port ${PORT} in ${NODE_ENV} mode`)
); // eslint-disable-line no-console