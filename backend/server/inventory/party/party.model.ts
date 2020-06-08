import { Document, Schema, Model, connection } from 'mongoose';
import {PartyS} from 'fivebyone';

interface PartyDoc extends PartyS, Document {}

const validateCode = (code2: string): boolean => {

  if (!code2 || code2.trim() === '') {

    return false;

  }
  return true;

};

export class PartyModel {

  private static partySchema = new Schema<PartyDoc>({
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    code: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      validate: {
        validator: validateCode,
        message: (props) => {

          return `${props.value} is not a valid code!`;

        }
      },
    },
    mobile: {
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      type: String,
    },
    email: {
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      type: String,
    },
    isCustomer: {
      type: Boolean,
    },
    isVendor: {
      type: Boolean,
    },
    addresses: {
      type: [ {
        type: {
          type: String,
        },
        addressLine1: {
          type: String,
        },
        addressLine2: {
          type: String,
        },
        addressLine3: {
          type: String,
        },
        addressLine4: {
          type: String,
        },
        state: {
          type: String,
          index: true,
        },
        country: {
          type: String,
          index: true,
        },
        pinCode: {
          type: String,
          index: true,
        },
        landMark: {
          type: String,
        },
      } ],
      required: true,

      validate: {
        validator: (adrss: []): boolean => {

          return adrss && adrss.length > 0;

        },
        message: () => {

          return 'Address is required.';

        }
      },
    },
    registrationNumbers: {
      type: [
        {
          name: {
            type: String,
          },
          value: {
            type: String,
          },
        }
      ]
    }
  });

  public static createModel = (dbName: string): Model<PartyDoc, {}> => {

    const mongoConnection = connection.useDb(dbName);
    return mongoConnection.model('Party', PartyModel.partySchema);

  }

}
