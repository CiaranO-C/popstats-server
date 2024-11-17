import { configDotenv } from "dotenv";
configDotenv();
import e from "express";
var app = e();
var PORT = process.env.PORT || 5500;
app.get("/", function (req, res) {
    res.json({ message: "hello" });
});
console.log("hello big time");
app.listen(PORT, function () { return console.log("Listening on port: ".concat(PORT)); });
