const key = process.env.key;
const secret = process.env.secret;
const tokenUrl = process.env.tokenUrl;
const scope = process.env.scope;
const flow = process.env.flow;

exports.getToken = async () => {
  if (key && secret && tokenUrl && scope && flow) {
    await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: key,
        client_secret: secret,
        scope: scope,
        grant_type: flow,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data.access_token);
      })
      .catch((error) => {
        return error;
      });
  } else {
    return new Error("Missing required environment variables");
  }
};
