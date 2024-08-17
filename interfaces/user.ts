
//util en fronend
export interface IUser {
    _id: string;
    name: string;
    email?: string; //kkkk
    password?: string;
    role: string;

    createdAt?: string;
    updatedAt?: string;
}