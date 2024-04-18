import { LoginStatusDictionary } from "./LoginStatusDictionary"
import { StatusEnum } from "./StatusEnum"

interface request {
    email: string | undefined | null,
    type: string,
    details: FixingJesta | null | undefined,
    status: StatusEnum,
    publishTime: number
}

interface user {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    phoneNumber: string
}

interface userLogin {
    user: user | null,
    status: LoginStatusDictionary
}

interface Photo {
    date: Date,
    src: any
}

interface FixingJesta {
    type: string,
    longDistance: Boolean,
    description: string,
    uploadedPhotos: Photo[],
    note: string,
    budget: string,
    location: string
}

export type { 
    user as userInteface,
    request as requestInteface,
    userLogin as userLoginInterface,
    Photo as PhotoInterface,
    FixingJesta as FixingJestaInterface
 }