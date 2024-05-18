

const url = "https://api.twitter.com/2/users/by?usernames=orna_friedman&user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=author_id,created_at";



const get_user = async (_req: Request, res: Response) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: _req.headers.authorization?.toString() || process.env.bearer_token
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res?.status(201).send(data);
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(401).send(error);
  }
};


export { get_user };
