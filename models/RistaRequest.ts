// models/RistaRequest.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRistaRequest extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  senderName: string;
  receiverName: string;
  message?: string;
  status: string;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RistaRequestSchema = new Schema<IRistaRequest>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    message: { type: String, maxlength: 500 },
    status: { 
      type: String, 
      enum: ['PENDING_ADMIN', 'SENT_TO_USER', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING_ADMIN'
    },
    adminNote: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);



const RistaRequest = mongoose.models.RistaRequest || mongoose.model<IRistaRequest>('RistaRequest', RistaRequestSchema);

export default RistaRequest;