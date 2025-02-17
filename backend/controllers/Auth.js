const { Author } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

async function verifyCode(code) {
  let { tokens } = await client.getToken(code);
  client.setCredentials({ access_token: tokens.access_token });
  const userinfo = await client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });
  return userinfo.data;
}

function jwtSign(user) {
  return jwt.sign(user, config.authentication.jwtSecret, { expiresIn: "7d" });
}

module.exports = {
  googleLogin: async (req, res, next) => {
    try {
      const { code } = req.body;
      const payload = await verifyCode(code);
      const { email, name, picture } = payload;

      let user = await Author.findOne({
        where: { email },
      });

      if (!user) {
        user = await Author.create({
          name: name,
          email: email,
        });
      }

      // Prepare user data for the token
      const loginUser = {
        id: user.id,
        name: user.username,
        email: user.email,
        avatar: picture,
      };

      // Return a JWT token and user information
      return res.status(200).send({
        message: "Google login successful!",
        user: loginUser,
        token: jwtSign(loginUser),
      });
    } catch (error) {
      console.error("Google login error:", error);
      return res.status(401).send({
        message: "Google login failed.",
        error: error.response.data,
      });
    }
  },
};
