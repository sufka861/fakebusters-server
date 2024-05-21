const BASE_URL = process.env.BASE_URL;
const get_user =async (username: string) => {
  const url = `${BASE_URL}?usernames=${username}&${process.env.twitter_fields}`;
  const authorizationHeader = process.env.BEARER_TOKEN || '';
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: authorizationHeader
    }
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};



export { get_user };
