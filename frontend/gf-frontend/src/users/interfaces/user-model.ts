export interface User {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ChangeValue{
    attribute: string;
    previousValue: string;
    newValue: string;
}

export interface ChangeRecord {
    objectId: number;
    changeDate: string;
    changedObjectId: number;
    user: User;
    changeValues: ChangeValue[];
}