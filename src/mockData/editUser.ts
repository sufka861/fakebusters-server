import fs from 'fs';
import path from 'path';

export interface Analysis {
    id: number;
    projectName: string;
    preqFileName: string;
    threshold: number;
    signature: number;
    typeOfAnalysis: number;
    word: string;
    freq: string;
    account: string;
    initiaAuthorsCount: string;
    initialPostsCount: string;
    FrequencyFile: string;
    resultsLPA: any[];
    sockpuppetData: any[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    analyses: Analysis[];
}


export const getUsersFromFile = (userID: number): User | undefined => {
    const filePath = path.join(__dirname, 'user.json'); 
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users: User[] = JSON.parse(fileData);
    
    const user = users.find(u => u.id === userID);
    return user;
};

export const updateUserToFile = (userToUpdate: User): void => {
    const filePath = path.join(__dirname, 'user.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    let users: User[] = JSON.parse(fileData);
    const existingUserIndex = users.findIndex(u => u.id === userToUpdate.id);

    if (existingUserIndex >= 0) {
        users[existingUserIndex] = userToUpdate;
    } else {
        users.push(userToUpdate);
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
};

export const addResultsToUser = (userID: number, newResults: Analysis[]): void => {
    const filePath = path.join(__dirname, 'user.json'); 
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users: User[] = JSON.parse(fileData);
    const user = users.find(u => u.id === userID);
    if (!user) {
        console.error('User not found');
        return;
    }
    user.analyses.push(...newResults);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    console.log('User results updated successfully');
};