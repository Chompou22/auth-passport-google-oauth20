import bodyParser from "body-parser";
import SequelizeStore from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import sequelize from "./config/database.js";
// import middleware from "./middleware/middleware.js";
import { extendDefaultFields } from "./model/session.js";
import router from "./route/index.js";
import "./strategies/google.js";

const sequelizeConfig = SequelizeStore(session.Store);

const storeConfig = new sequelizeConfig({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
  extendDefaultFields: extendDefaultFields,
});

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true,
};

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.set("trust proxy", 1);

// Initialize session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only secure cookie in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "strict",
    },
    store: storeConfig,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Error handling middleware (should come before routes)
// app.use(middleware.notFound);
// app.use(middleware.errorHandler);

// Routes
app.use("/api/v1", router);

// Welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my authentication",
  });
});

export default app;
