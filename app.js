"use strict";

const express = require("express");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

let app = express();

// App settings
app.set("view engine", "pug");

// App middleware
app.use("/", express.static("public"));


app.use(session({
  cookie: { httpOnly: true },
  secret: "long random string"
}));

let oidc =  new ExpressOIDC({
  issuer: "",
  client_id: "",
  client_secret: "",
  redirect_uri: "",
  routes: {
      callback: { defaultRedirect: "/dashboard" }
  },
  scope: 'openid profile'
});

// App routes
app.use(oidc.router);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", oidc.ensureAuthenticated(), (req, res) => {
  console.log(req.userinfo);
  res.render("dashboard", { user: req.userinfo });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

oidc.on("ready", () => {
  app.listen(3000);
});

oidc.on("error", err => {
  console.error(err);
});