import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async register(username: string, password: string): Promise<User> {
    const newUser = new this.userModel({
      username,
      password,
      resetToken: null,
      resetTokenExpiry: null,
    });
  
    return newUser.save();
  }  

  async storeResetToken(username: string, token: string): Promise<void> {
    await this.userModel.updateOne(
      { username },
      { resetToken: token, resetTokenExpiry: Date.now() + 3600000 }
    ).exec();
  }

  async verifyResetToken(token: string): Promise<string | null> {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    }).exec();

    return user ? user.username : null;
  }

  async updatePassword(username: string, newPassword: string): Promise<void> {
    await this.userModel.updateOne(
      { username },
      { password: newPassword, resetToken: null, resetTokenExpiry: null }
    ).exec();
  }
}
