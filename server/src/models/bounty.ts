import { model, Schema, Types } from 'mongoose';
import { IOrganisation } from './organisation';

interface IPrize {
  priceAmount: number;
  priceCurrency: string;
}

interface IBounty {
  name: string;
  openStatus: boolean;
  organisation: Types.ObjectId | IOrganisation;
  submitLink: string;
  contactLink: string;
  skillsNeeded: string[];
  prizes: IPrize[];
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const prizeSchema = new Schema<IPrize>({
  priceAmount: { type: Number, required: true },
  priceCurrency: { type: String, required: true },
});

const bountySchema = new Schema<IBounty>(
  {
    name: { type: String, required: true },
    openStatus: { type: Boolean, default: true },
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
    submitLink: { type: String, required: true },
    contactLink: { type: String, required: true },
    skillsNeeded: [{ type: String }],
    prizes: [prizeSchema],
    details: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Bounty = model<IBounty>('Bounty', bountySchema);

export { Bounty, IBounty, IPrize };
