import { configDotenv } from "dotenv";
configDotenv();
import e from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema";

const app = e();
const PORT = process.env.PORT || 5500;

const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(e.json({ limit: "50mb" }));

app.all("/graphql", createHandler({ schema }));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
