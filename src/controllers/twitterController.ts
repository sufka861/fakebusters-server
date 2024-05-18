
import { Request, Response } from 'express';
const BASE_URL = process.env.BASE_URL;
const get_user = async (_req: Request, res: Response) => {
  const username = _req.query.username?.toString();
  if (!username) {
    res.status(400).send({ error: 'Username is missing' });
    return;
  }
  const url = `${BASE_URL}?usernames=${username}&${process.env.twitter_fields}`;
  const authorizationHeader = _req.headers.authorization?.toString() || process.env.BEARER_TOKEN;
  
  if (!authorizationHeader) {
    res.status(401).send({ error: 'Authorization token is missing' });
    return;
  }
  const options = {
    method: 'GET',
    headers: {
      Authorization: authorizationHeader
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
