export class Chat {
    organizer: string;
    participant: string;
    workshop: string;
    messages: [
        {
            sender: string;
            timestamp: string;
            text: string;
        }
    ]
}