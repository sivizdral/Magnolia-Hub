export class UserFull {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    type: string;
    email: string;
    status: string;
    phone: string;
    orgData: {
        organizationName: string;
        organizationAddress: string;
        taxNumber: string;
    };
    likes: [];
    comments: [];
    pastWorkshops: [];
    pendingWorkshops: [];
    photo: [];
}