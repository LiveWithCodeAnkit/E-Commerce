import { Document, Model, ObjectId, Schema, model, models } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";
import bcrypt from "bcrypt";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60 * 24,
  },
});

PasswordResetTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) {
      return next();
    }

    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } catch (error) {
    throw error;
  }
});

PasswordResetTokenSchema.methods.compareToken = async function (token) {
  try {
    return await bcrypt.compare(token, this.token);
  } catch (error) {
    throw error;
  }
};


const PasswordResetTokenModel =
  models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetTokenModel as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
