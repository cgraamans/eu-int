export interface User {
    secret:string,
    data?:UserData,
}

export interface UserData {
    name:string,
    email:string,
    token:string,
}