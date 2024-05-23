import { ObjectId } from "mongodb";

export interface Result {
    _id?: ObjectId;  
    account: number;    // number of accounts been processed
    freq: number;   // 
    initial_authors_count: number;   // total authors count from dataset 
    initial_posts_count: number;    // total posts count from dataset
    categories: string[];   // array of every word and its frequency
    data: number[];   // array of frequency of each word in correlation to the word's index
    word: number;   // number of words
    project_id: string;   // result file name+uuid = analysis id
    results: Object[];    // array of objects, each object: 2 profiles and distance
    vocabulary_id: ObjectId
}

