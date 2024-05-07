import { LoginStatusDictionary } from "./LoginStatusDictionary"
import { StatusEnum } from "./StatusEnum"
import { UserStatusDictionary } from "./userStatusDictionary"

interface Page {
    name: string,
    component: React.ComponentType<any>,
    isOpen: boolean
}

interface request {
    email: string | undefined | null,
    type: string,
    details: FixingJesta | null | undefined,
    status: StatusEnum,
    publishTime: number,
    provider: string | null
}

interface user {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    phoneNumber: string,
    status: UserStatusDictionary,
    lastSeen: number
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
    FixingJesta as FixingJestaInterface,
    Page as PageInterface
}