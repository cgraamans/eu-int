import { EUINT } from "../../types";
import DB from "../services/db"

export default class Session {

    public user?:EUINT.User;
    public messages:any[] = [];
    public rooms:any[] = [];

    constructor(){};

    public async validate(token:string){

        // check user token and lifetime on db  
        

    };

    public async login(name:string,password:string) {

    }

    public async register(name:string,password:string) {

    }

}