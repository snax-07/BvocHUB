import { Schema, Document, model, models } from 'mongoose';

// Video schema interface and model
interface Video extends Document {
  title: string;
  description?: string;  // Optional field
  url: string;
  duration: number;
  uploader: string;
}

const VideoSchema = new Schema<Video>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: null },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    uploader: { type: String, required: true },
  },
  { timestamps: true }
);

// PDF schema interface and model
interface Pdf extends Document {
  title: string;
  description?: string;  // Optional field
  url: string;
  uploader: string;
  size : number
}

const PdfSchema = new Schema<Pdf>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: null },
    url: { type: String, required: true },
    uploader: { type: String, required: true },
    size : {type : Number , required : true}
  },
  { timestamps: true }
);

// User schema interface and model
interface User extends Document {
  fullName: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Create models with safe handling for reloading
const User = models?.User || model<User>('User', UserSchema);
const Video = models?.Video || model<Video>('Video', VideoSchema);
const Pdf = models?.Pdf || model<Pdf>('Pdf', PdfSchema);

// Export models
export { User, Video, Pdf };
