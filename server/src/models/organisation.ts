import { Schema, model } from 'mongoose';
import { Organisation as SharedOrganisation } from '../../../shared/types';

// Extend the shared type with Mongoose-specific types
export interface IOrganisation
  extends Omit<SharedOrganisation, 'id' | 'logo' | 'createdAt' | 'updatedAt'> {
  logo: {
    data: Buffer;
    contentType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const organisationSchema = new Schema<IOrganisation>(
  {
    name: { type: String, required: true },
    logo: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },
    contactLink: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Organisation = model<IOrganisation>('Organisation', organisationSchema);
