import app from "./app";

import { config } from "./config/env.config";

void async function() {

   app.listen(config.PORT);

   console.log(`[INFO]: ${config.NODE_ENV} sever started. Available at ==> http://localhost:${config.PORT}/api/v1`);
}();