import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Firebase UID of the profile owner
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Personal information
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say", ""],
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    mobileNumber: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // Academic information
    college: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    department: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    course: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    currentYear: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    semester: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    studentId: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },

    // Contact information
    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
