export class Workshop {
    name: string;
    date: Date;
    location: string;
    organizer: string;
    photo: Object;
    short_description: string;
    long_description: string;
    gallery: [];
    status: string;
    capacity: number;
    participantsList: [];
    pendingList: [];
    waitingList: [];
    likes: [];
    comments: [];
}