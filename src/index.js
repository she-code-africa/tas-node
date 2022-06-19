import express from 'express'

import { Host, Port } from './constants'
import routes from './router'

const PORT = process.env.PORT || Port

async function main() {
  const app = express()

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(routes);

  app.listen(PORT, Host, () => console.log(`tas-node: listening on port: ${PORT}`))
}

process.on('uncaughtException', function (err) {
  console.log(err);
});

main().catch((e) => console.log(e))