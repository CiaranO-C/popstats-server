import { configDotenv } from "dotenv";
import { Request, Response } from "express"
configDotenv();
import e from "express";

const app = e();
const PORT = process.env.PORT || 5500;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

console.log("hello big time")
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
