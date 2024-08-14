import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: [String], // Array of genres
        required: true,
    },
    director: {
        type: String,
        required: true,
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
    description: {
        type: String,
        required: true,
        trim: true,
    },
    coverImage: {
        type: String, // URL to the cover image
    },
    ottAvailability: [{
        platform: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Movie = mongoose.model('Movie', movieSchema);
