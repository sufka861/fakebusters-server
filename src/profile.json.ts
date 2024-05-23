import { float } from "aws-sdk/clients/cloudfront";

interface Profile {
  _id?: ObjectId;
  data: [
    {
      twitter_id: string;
      pinned_tweet_id: string;
      username: string;
      created_at: Date;
      location: string;
      profile_image_url: string;
      verified_type: string;
      description: string;
      verified: string;
      url: string;
      name: string;
      most_recent_tweet_id: string;
      public_metrics: object; // followers_count, following_count, tweet_count,like_count
    }
  ];
  includes: {
    tweets: Tweet[]; // last tweet posted by the profile
  };
  analysis: [{
    suspect_username: string;
    comment: string;
    analyzer_commented: string;
    score: float; 
  }]
}

interface Tweet {
  id: string;
  author_id: string;
  possibly_sensitive: boolean;
  created_at: Date;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
  text: string;
  urls: {}[]; // urls related to the tweet (attachments, links)
  reply_settings: string;
}