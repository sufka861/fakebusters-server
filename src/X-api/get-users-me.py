import json
import os
from requests_oauthlib import OAuth1Session

fields = "created_at,id,location,most_recent_tweet_id,profile_image_url,public_metrics,username,withheld,verified_type,description,verified,url,name,protected,pinned_tweet_id,entities"
params = {"user.fields": fields}
# Load Twitter API keys and tokens from a JSON file
script_dir = os.path.dirname(os.path.realpath(__file__))
keys = os.path.join(script_dir, 'twitter_keys.json')

def get_users_me():
    with open(keys) as infile:
        json_obj = json.load(infile)
        consumer_key = json_obj["consumer_key"]
        consumer_secret = json_obj["consumer_secret"]
        access_token = json_obj["access_token"]
        access_token_secret = json_obj["access_token_secret"]
        request_token_url = json_obj["request_token_url"]

    oauth = OAuth1Session(consumer_key, client_secret=consumer_secret)
    try:
        fetch_response = oauth.fetch_request_token(request_token_url)
    except ValueError:
        print(
            "There may have been an issue with the consumer_key or consumer_secret you entered."
        )

    resource_owner_key = fetch_response.get("oauth_token")
    print("Got OAuth token: %s" % resource_owner_key)

    # # Get authorization
    base_authorization_url = "https://api.twitter.com/oauth/authorize"
    authorization_url = oauth.authorization_url(base_authorization_url)
    print("Please go here and authorize: %s" % authorization_url)
    
    oauth = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_token_secret,
    )

    response = oauth.get("https://api.twitter.com/2/users/me",params=params)

    if response.status_code != 200:
        raise Exception(
            "Request returned an error: {} {}".format(response.status_code, response.text)
        )

    print("Response code: {}".format(response.status_code))

    json_response = response.json()

    print(json.dumps(json_response, indent=4, sort_keys=True))

if __name__ == "__main__":
    get_users_me()