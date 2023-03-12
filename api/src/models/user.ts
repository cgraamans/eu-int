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

    public async insertUserToken(userId:number,token:string,dt:number) {

        const res = await DB.q(`INSERT INTO user_tokens SET ?`,[{
                user_id:userId,token:token,dt:dt
            }])
            .catch(e=>console.log(e));

        if (!res || !res.insertId || res.insertId < 1) return;

        return res.insertId;

    }


    public async insertUserRoles(userId:number,roles:string[]|string) {

        if(typeof roles === 'string') roles = [roles];

        await Promise.all(roles.map(async (role)=>{

            // get role
            const roleList = await DB.q(`SELECT * FROM roles WHERE name = ?`,[role]).catch(e=>{})
            if(!roleList || roleList.length < 1) return;
            const roleId = roleList[0].id;

            //does the user have the role already?
            // const hasRole = await DB.q(``)

            // insert user_role
            const res = await DB.q(`INSERT INTO user_role SET ?`,[{
                user_id:userId,role_id:roleId
            }])
            .catch(e=>console.log(e));
       
        }));

        // if (!res || !res.insertId || res.insertId < 1) return;

        // return res.insertId;

    }

    public async updateUser(name:string,email:string,password:string,nickname?:string){}

    public async deleteUser(email:string){}

    

};

export default new User();