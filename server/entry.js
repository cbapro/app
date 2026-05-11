import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./index.js";

const app = express();

// Reject common bot/scanner probes before they touch Remix
const BOT_PATTERNS = /\.(php|asp|aspx|jsp|cgi|pl|py|rb|env|git|svn|htaccess|htpasswd|bak|conf|config|sql|xml|ini|log|db|sqlite|sh|bash|csh|zsh|bat|cmd|ps1)$/i;
const BOT_PATH_PATTERNS = /^\/wp-|^\/wordpress|^\/phpmyadmin|^\/admin\.php|^\/setup\.php|^\/install\.php|^\/xmlrpc\.php/i;

app.use((req, res, next) => {
  if (BOT_PATTERNS.test(req.path) || BOT_PATH_PATTERNS.test(req.path)) {
    return res.status(404).end();
  }
  next();
});

app.use(express.static("public", { maxAge: "1h", immutable: true }));

app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Remix server listening on port ${port}`);
});
