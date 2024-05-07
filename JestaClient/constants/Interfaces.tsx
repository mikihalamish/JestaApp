import { LatLng } from "react-native-maps"
import { LoginStatusDictionary } from "./LoginStatusDictionary"
import { PagesDictionary } from "./PagesDictionary"
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

interface User {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    phoneNumber: string,
    status: UserStatusDictionary,
    lastSeen: number
}

interface UserLogin {
    user: User | null,
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

interface PickerItem {
    label: string;
    value: string;
}

interface FixType {
    name: string,
    icon: any
}

interface Service {
    name: string,
    icon: any,
    page: PagesDictionary
}

interface UserLocation {
    user: User,
    coordinates: LatLng
}

export type {
    User as UserInterface,
    request as requestInteface,
    UserLogin as UserLoginInterface,
    Photo as PhotoInterface,
    FixingJesta as FixingJestaInterface,
    Page as PageInterface,
    PickerItem as PickerItemInterface,
    FixType as FixTypeInterface,
    Service as ServiceInterface,
    UserLocation as UserLocationInterface
}