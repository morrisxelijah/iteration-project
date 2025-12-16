import mongoose, { Schema, Document } from 'mongoose';

// Trips Document (storing all the trips the user's planned)
interface Trips extends Document {
  name: string;
  people: string[];
  budget: number;
}

const TripsSchema = new Schema<Trips>({
  name: { type: String, required: true },
  people: { type: [String], required: true },
  budget: { type: Number, required: true },
});

const Trips = mongoose.model<Trips>('Trips', TripsSchema);

export default Trips;
