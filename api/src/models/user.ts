import DB from "../services/db";

const User = class User {

    public async allUser() {
        return DB.q('SELECT * FROM User',[]).catch(e=>console.log(e));
    };

    public async getUserByEmail(email:string){

        return await DB.q(`SELECT * FROM user WHERE email = ?`, [email]).catch(e=>console.log(e));

    }

    public async insertUser(email:string,password:string) {

        const res = await DB.q(`INSERT INTO user (email, password) SET ?`,[{
                email:email,
                password:password,
            }])
            .catch(e=>console.log(e));

        if (!res || !res.insertId || res.insertId < 1) return;

        return res.insertId;

    }

    public async updateUser(name:string,email:string,password:string,nickname?:string){}

    public async deleteUser(email:string){}

    

};

export default new User();