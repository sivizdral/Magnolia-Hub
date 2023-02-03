export class Workshop {
    workshop_id: string;
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