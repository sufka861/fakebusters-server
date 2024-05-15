const got = require("got");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const qs = require("querystring");
import dotenv from "dotenv";

dotenv.config();

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const client_secret = process.env.CLIENT_SECRET!;

const endpointURL = `https://api.twitter.com/2/users/me`;

const authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
const accessTokenURL = "https://api.twitter.com/oauth/access_token";

const requestTokenURL =
  "https://api.twitter.com/oauth/request_token?oauth_callback=oob";

const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString: string, key: string) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

async function requestToken() {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: "POST",
    }),
  );

  const req = await got.post(requestTokenURL, {
    headers: {
      Authorization: authHeader["Authorization"],
    },
  });

  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error("Cannot get an OAuth request token");
  }
}

async function accessToken(
  { oauth_token, oauth_token_secret }: any,
  verifier: string,
) {
  console.log("Captured oauth_verifier:", verifier); // Log the captured value

  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: "POST",
    }),
  );

  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
  console.log(`PATH ${path}`);
  const req = await got.post(path, {
    headers: {
      Authorization: authHeader["Authorization"],
    },
  });

  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error("Cannot get an OAuth access token");
  }
}
async function getRequest({
  oauth_token,
  oauth_token_secret,
}: {
  oauth_token: string;
  oauth_token_secret: string;
}) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "GET",
      },
      token,
    ),
  );

  const req = await got(endpointURL, {
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2UserLookupJS",
    },
  });

  if (req.body) {
    return JSON.parse(req.body);
  } else {
    throw new Error("Unsuccessful request");
  }
}

async function main() {
  try {
    const oAuthRequestToken = await requestToken();
    authorizeURL.searchParams.append(
      "oauth_token",
      oAuthRequestToken.oauth_token,
    );
    console.log("Please go here and authorize:", authorizeURL.href);
    const oAuthAccessToken = await accessToken(
      oAuthRequestToken,
      client_secret?.trim(),
    );
    const response = await getRequest(oAuthAccessToken);
    console.dir(response, {
      depth: null,
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
}

export {
  accessToken,
  requestToken,
  getRequest,
  authorizeURL,
  client_secret,
  main,
};
