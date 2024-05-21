import { userModel } from '../models/user.model.js';
import { DateTime } from 'luxon';

class UserManager {
  constructor() {}

  //!GET

  async getUsers() {
    try {
      const users = await userModel.find();
      if (!users) {
        return req.logger.error(`Could not get users`);
      }
      return users;
    } catch (error) {
      req.logger.error(error);
    }
  }

  //!Get by ID

  async getUserById(uId) {
    if (!uId) {
      return console.log(`Id not received`);
    }
    try {
      const user = await userModel.findOne({ _id: uId });
      if (!user) {
        return console.log(`Could not find user`);
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  //!Create

  async createUser(user) {
    if (!user) {
      return console.log(`User not received`);
    }
    try {
      await userModel.create(user);
      return console.log(`User created`);
    } catch (error) {
      console.log(error);
    }
  }

  //!Update

  async modifyUser(uId, modifiedUser) {
    if (!uId || !modifiedUser) {
      return console.log(`Incomplete params`);
    }
    try {
      const updatedUser = await userModel.updateOne({ _id: uId }, modifiedUser);
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  //!Delete

  async deleteUser(uId) {
    if (!uId) {
      return console.log(`Incomplete params`);
    }
    try {
      const user = await userModel.findOne({ _id: uId });
      await userModel.deleteOne({ _id: uId });
      return console.log(
        `User ${user.first_name}${user.last_name} has been deleted`
      );
    } catch (error) {
      console.log(error);
    }
  }

  //*DELETE LAST_CONNECTION > 2.DAYS
  async lastConnectionDelete() {
    let now = DateTime.now();
    let twoDaysAgo = now.minus({ days: 14 });

    try {
      const users = await userModel.find({
        last_connection: { $lt: twoDaysAgo },
      });
      if (!users) {
        return console.log('No users to delete');
      }
      return users;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserManager;
