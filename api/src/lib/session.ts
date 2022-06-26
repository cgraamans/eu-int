import { EUINT } from "../../types";
import {db} from "../services/db"

export default class Session {

    public user?:EUINT.User;

    constructor(){};

    public async login(token?:string) {

        // insert (new) token into database
        // user.token gets (new) token
        // return true;

    }

    public async logout() {

        //  invalidate token
        //  destroy user object
        //  return true;

    }


    public async tokenRefresh() {

        // insert new token into database
        // return new token

    }

}