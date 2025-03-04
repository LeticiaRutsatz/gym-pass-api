import { app } from './app';
import { env } from './env';

app.listen({
    port: env.PORT,
    host: "0.0.0.0"
 }, () => {
    console.log("Server is running on http://0.0.0.0:3000");
})
