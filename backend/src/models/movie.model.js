import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    tmdbId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    genres: {
        type: [String], // Array of genres
        required: true,
    },
    director: {
        type: String,
        trim: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    runtime: {
        type: Number, // runtime in minutes
        required: true,
    },
    overview: { // description
        type: String,
        required: true,
        trim: true,
    },
    posterPath: { // URL to the cover image
        type: String,
    },
    ottProviders: [{ // Renamed from ottAvailability for consistency
        platform: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Movie = mongoose.model('Movie', movieSchema);
