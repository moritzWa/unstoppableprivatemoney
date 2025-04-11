import { model, Schema, Types } from 'mongoose';
import { Bounty as SharedBounty } from '../../../shared/types';
import { IOrganisation } from './organisation';

// Extend the shared type with Mongoose-specific types
export interface IBounty
  extends Omit<SharedBounty, 'id' | 'organisation' | 'createdAt' | 'updatedAt'> {
  organisation: Types.ObjectId | IOrganisation;
  createdAt: Date;
  updatedAt: Date;
}

const bountySchema = new Schema<IBounty>(
  {
    name: { type: String, required: true },
    openStatus: { type: Boolean, default: true },
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
    submitLink: { type: String, required: true },
    contactLink: { type: String, required: true },
    skills: { type: String, required: true },
    prizes: { type: String, required: true },
    prizeCurrency: { type: String, required: true },
    details: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Bounty = model<IBounty>('Bounty', bountySchema);
