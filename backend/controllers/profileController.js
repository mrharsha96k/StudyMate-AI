import Profile from "../models/Profile.js";

const allowedFields = [
  "fullName",
  "gender",
  "dateOfBirth",
  "mobileNumber",
  "college",
  "department",
  "course",
  "currentYear",
  "semester",
  "studentId",
  "address",
  "city",
  "state",
  "country",
];

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    let profile = await Profile.findOne({
      userId: req.user.uid,
    });

    // Create an empty profile the first time the user visits.
    if (!profile) {
      profile = await Profile.create({
        userId: req.user.uid,
        fullName: "",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load profile.",
    });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.fullName !== undefined &&
      (typeof updates.fullName !== "string" ||
        updates.fullName.trim().length < 2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain at least 2 characters.",
      });
    }

    if (
      updates.gender !== undefined &&
      !["Male", "Female", "Other", "Prefer not to say", ""].includes(
        updates.gender
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender selection.",
      });
    }

    if (
      updates.dateOfBirth !== undefined &&
      updates.dateOfBirth !== null
    ) {
      const date = new Date(updates.dateOfBirth);

      if (Number.isNaN(date.getTime()) || date > new Date()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid date of birth.",
        });
      }

      updates.dateOfBirth = date;
    }

    if (
      updates.mobileNumber !== undefined &&
      (typeof updates.mobileNumber !== "string" ||
        !/^[0-9+\-()\s]{7,20}$/.test(updates.mobileNumber.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number.",
      });
    }

    for (const [field, value] of Object.entries(updates)) {
      if (
        field !== "dateOfBirth" &&
        (typeof value !== "string" ||
          value.length > getMaxLength(field))
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid value for ${field}.`,
        });
      }

      if (typeof value === "string") {
        updates[field] = value.trim();
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.uid },
      {
        $set: updates,
        $setOnInsert: { userId: req.user.uid },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

function getMaxLength(field) {
  const lengths = {
    fullName: 100,
    mobileNumber: 20,
    college: 150,
    department: 100,
    course: 100,
    currentYear: 30,
    semester: 30,
    studentId: 50,
    address: 300,
    city: 100,
    state: 100,
    country: 100,
  };

  return lengths[field] ?? 300;
}