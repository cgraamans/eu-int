import { EUINT } from "../../types";
import {db} from "../services/db"
import fs from "fs";

export const eventBuilder = (directory:string,designation?:string)=> {

    let r:{socket:string,file:string}[] = [],
      list: fs.Dirent[] = [];

    const directoryContents = fs.readdirSync(directory,{withFileTypes:true});
    list = directoryContents.filter(x=>!x.isDirectory());
    list.forEach(file=>{

      const name = file.name.split(".")[0];
      r.push({
        socket:designation ? designation + ":" + name : name,
        file:directory + "/" + file.name
      });
    
    });

    const filteredDirectores = directoryContents.filter(x=>x.isDirectory());
    filteredDirectores.forEach(dir=>{
      const directoryContentsRecursive = eventBuilder(directory+"/"+dir.name,dir.name);
      r = directoryContentsRecursive.concat(r);
    });

    return r;

};

export const whereBuilder = (whereArr:string[]) => {

  let sql = "WHERE";
  let varcount = 0;
  
  for(let i=0,c = whereArr.length;i<c;i++) {

    if(i>0) sql += "AND";

    let Where = whereArr[i];
    const matches = whereArr[i].match(/$./gm);

    matches.forEach(match=>{
    
      varcount++;
      Where = Where.replace(match,`$${varcount}`);
    
    });

    sql += Where;

  }

  return sql;

}