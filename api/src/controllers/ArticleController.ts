
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";

import { Articles } from "../entity/Articles";

class UserController{

static listAll = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = AppDataSource.getRepository(Articles);
  const users = await userRepository.find({
    select: ["id", "title", "role"] //We dont want to send the passwords on response
  });

  //Send the users object
  res.send(users);
};

static getOneById = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id: number = req.params.id as unknown as number;

  //Get the user from database
  const userRepository = AppDataSource.getRepository(Articles);
  try {
    const user = await userRepository.findOneOrFail({
      where:{
        id:id
      },
      select: ["id", "title", "role"] //We dont want to send the password on response
    });
  } catch (error) {
    res.status(404).send("User not found");
  }
};
};

export default UserController;