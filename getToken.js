require("dotenv").config();

const key = process.env.key;
const secret = process.env.secret;
const tokenUrl = process.env.tokenUrl;
const scope = process.env.scope;
const flow = process.env.flow;

exports.getToken = async () => {
  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: flow,
        scope: scope,
        client_id: key,
        client_secret: secret,
      }),
    });

    const tokenJson = await tokenResponse.json();

    const token = tokenJson.access_token;

    return token;
  } catch (err) {
    return err;
  }
};
