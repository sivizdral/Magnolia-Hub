export class Workshop {
    workshop_id: string;
    name: string;
    date: string;
    location: string;
    organizer: string;
    photo: Object;
    short_description: string;
    long_description: string;
    gallery: [any];
    status: string;
    capacity: number;
    participantsList: [];
    pendingList: [];
    waitingList: [];
    likes: [];
    comments: [];
}