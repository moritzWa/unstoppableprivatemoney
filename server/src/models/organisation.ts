import { Schema, model } from 'mongoose';

export interface IOrganisation {
  name: string;
  logo: {
    data: Buffer;
    contentType: string;
  };
  contactLink: string;
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
