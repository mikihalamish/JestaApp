import { StatusEnum } from "./StatusEnum"

interface request {
    type: string,
    details: any,
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

export type { 
    user as userInteface,
    request as requestInteface,
 }