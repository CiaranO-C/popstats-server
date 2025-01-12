import { configDotenv } from "dotenv";
configDotenv();
import e from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./graphql/schema.js";

import { uploadRouter } from "./upload/uploadRouter.js";

const app = e();
const PORT = process.env.PORT || 5500;

const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(e.json({ limit: "50mb" }));
app.use(e.urlencoded({ extended: true }));

app.use("/upload", uploadRouter);
app.use((req, res, next) => {
  console.log(req.body); // logs fine here
  next();
});
app.all(
  "/graphql",
  createHandler({
    schema,
    context: (req, args) => {
      const { userId } = req.raw.body.variables;
      return { userId };
    },
  }),
);



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
