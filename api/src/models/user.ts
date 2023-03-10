import DB from "../services/db";

const User = class User {

    public async allUser() {
        return DB.q('SELECT * FROM users',[]).catch(e=>console.log(e));
    };

    public async getUserByEmail(email:string){

        return await DB.q(`SELECT * FROM users WHERE email = ?`, [email]).catch(e=>console.log(e));

    }

    public async getUserByName(name:string){

        return await DB.q(`SELECT * FROM users WHERE username = ?`, [name]).catch(e=>console.log(e));

    }

    public async insertUser(username:string,password:string,email?:string) {

        let emailInclInsert = "(username, password, secret)";
        let emailIncData:{
            username:string,password:string,email?:string
        } = {
            username:username,
            password:password
        };
        if(email) {
            emailInclInsert = "(username, password, email)";
            emailIncData.email = email;
        }

        const res = await DB.q(`INSERT INTO users SET ?`,[emailIncData])
            .catch(e=>console.log(e));

        if (!res || !res.insertId || res.insertId < 1) return;

        return res.insertId;

    }

    public async updateUser(name:string,email:string,password:string,nickname?:string){}

    public async deleteUser(email:string){}

    

};

export default new User();