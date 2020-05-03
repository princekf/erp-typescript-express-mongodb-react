import { pbkdf2Sync, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { Document, Schema, model } from 'mongoose';
import { SchemaDef } from '../../types';
import {Constants} from 'fivebyone';

const {SECOND_IN_MILLIE} = Constants;

const ITERATIONS = 100000;
const KEY_LENGTH = 512;
const EXPIRY_IN_MINUTES = 30;
const BYTE_SIZE = 16;
interface User {
  // _id: any;
  email: string;
  hash: string;
  salt: string;
}
// Declare the model interface
interface UserDoc extends User, Document {
  setPassword(password: string): void;
  isPasswordValid(password: string): boolean;
  generateJwt(): { token: string; expiry: Date };
}

const userSchemaDef: SchemaDef<User> = {

  email: {
    type: String,
    // Important! We want users to be unique
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
};

// Declare the model schema
const userSchema = new Schema(userSchemaDef);

// Define some public methods for our model
class UserClass {

  private id: string;

  private email: string;

  private salt: string;

  private hash: string;

  // Create a salt and hash from the password
  public setPassword(password: string) {

    this.salt = randomBytes(BYTE_SIZE).toString('hex');
    this.hash = pbkdf2Sync(password, this.salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');

  }

  // Check if hashes match
  public isPasswordValid(password: string): boolean {

    const hash = pbkdf2Sync(password, this.salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');
    return this.hash === hash;

  }

  // Generate access token for 30 minutes
  public generateJwt(): { token: string; expiry: Date } {

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + EXPIRY_IN_MINUTES);

    const token = sign(
      {
        _id: this.id,
        email: this.email,
        exp: Math.round(expiry.getTime() / SECOND_IN_MILLIE),
      }, process.env.AUTH_SHARED_SECRET,
    );

    return {
      token,
      expiry,
    };

  }

}

// Important! Don't forget to use loadClass so your new methods will be included in the model
userSchema.loadClass(UserClass);

export default model<UserDoc>('User', userSchema);
