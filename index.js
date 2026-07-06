require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/auth");

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("Mongodb connected"))
  .catch(console.error);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true },
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
