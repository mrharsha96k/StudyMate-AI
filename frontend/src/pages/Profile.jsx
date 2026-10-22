import { useEffect, useState } from "react";
import { auth } from "../firebase";
import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";

import {
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/profile";

const emptyProfile = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  mobileNumber: "",
  college: "",
  department: "",
  course: "",
  currentYear: "",
  semester: "",
  studentId: "",
  address: "",
  city: "",
  state: "",
  country: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "text-sm font-medium text-slate-300";

// IMPORTANT: Keep Field outside Profile to prevent input remounting.
function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  options,
  required = false,
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          <option value="">Select {label.toLowerCase()}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          max={
            type === "date"
              ? new Date().toISOString().slice(0, 10)
              : undefined
          }
          className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-70`}
        />
      )}
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [form, setForm] = useState(emptyProfile);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = auth.currentUser;

  const getToken = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return currentUser.getIdToken();
  };

  // Load the authenticated user's profile.
  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        if (!active) return;

        const saved = data.profile || {};

        const loadedProfile = {
          ...emptyProfile,
          ...saved,
          dateOfBirth: saved.dateOfBirth
            ? String(saved.dateOfBirth).slice(0, 10)
            : "",
          fullName:
            saved.fullName || auth.currentUser?.displayName || "",
        };

        setProfile(loadedProfile);
        setForm(loadedProfile);
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Update form state without remounting inputs.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setForm({ ...profile });
    setEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setEditing(false);
    setError("");
    setSuccess("");
  };

  // Save profile changes to MongoDB through the authenticated API.
  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.mobileNumber.trim()) {
      const mobilePattern = /^[0-9+\-()\s]{7,20}$/;

      if (!mobilePattern.test(form.mobileNumber.trim())) {
        setError("Please enter a valid mobile number.");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      const payload = {
        ...form,
        fullName: form.fullName.trim(),
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save your profile.");
      }

      const saved = data.profile || payload;

      const updatedProfile = {
        ...emptyProfile,
        ...saved,
        dateOfBirth: saved.dateOfBirth
          ? String(saved.dateOfBirth).slice(0, 10)
          : "",
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setEditing(false);
      setSuccess("Your profile has been saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const displayInitial = (
    profile.fullName || user?.displayName || user?.email || "S"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  const fieldProps = {
    value: undefined,
    onChange: handleChange,
    disabled: !editing || saving,
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-80 items-center justify-center">
          <FaSpinner className="animate-spin text-3xl text-blue-400" />

          <span className="ml-3 text-sm text-slate-400">
            Loading your profile...
          </span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-7 pb-10">
        <PageHeader
          title="Profile Settings"
          description="Manage your personal and academic information."
          icon={<FaUser />}
        />

        {/* Profile summary */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-3xl font-bold text-blue-400">
                {displayInitial}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Student Profile
                </p>

                <h2 className="mt-1 break-words text-xl font-bold text-white sm:text-2xl">
                  {profile.fullName || "Complete your profile"}
                </h2>

                <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-400">
                  <FaEnvelope className="shrink-0" />
                  {user?.email || "Email unavailable"}
                </p>

                {profile.course && (
                  <p className="mt-1 text-sm text-slate-400">
                    {profile.course}
                    {profile.department
                      ? ` · ${profile.department}`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
            <FaCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FaUser className="text-lg" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your basic personal details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                {...fieldProps}
                label="Full Name"
                name="fullName"
                value={form.fullName}
                placeholder="Enter your full name"
                required
              />

              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Your email is managed by Firebase Authentication.
                </p>
              </div>

              <Field
                {...fieldProps}
                label="Gender"
                name="gender"
                value={form.gender}
                options={[
                  "Male",
                  "Female",
                  "Other",
                  "Prefer not to say",
                ]}
              />

              <Field
                {...fieldProps}
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
              />

              <Field
                {...fieldProps}
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                placeholder="Enter mobile number"
              />
            </div>
          </section>

          {/* Academic information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <FaGraduationCap className="text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Academic Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your college and education details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                {...fieldProps}
                label="College / University"
                name="college"
                value={form.college}
                placeholder="Enter college name"
              />

              <Field
                {...fieldProps}
                label="Department"
                name="department"
                value={form.department}
                placeholder="e.g. Computer Science Engineering"
              />

              <Field
                {...fieldProps}
                label="Course / Class"
                name="course"
                value={form.course}
                placeholder="e.g. B.Tech CSE"
              />

              <Field
                {...fieldProps}
                label="Current Year"
                name="currentYear"
                value={form.currentYear}
                options={[
                  "First Year",
                  "Second Year",
                  "Third Year",
                  "Fourth Year",
                  "Other",
                ]}
              />

              <Field
                {...fieldProps}
                label="Current Semester"
                name="semester"
                value={form.semester}
                options={[
                  "Semester I",
                  "Semester II",
                  "Semester III",
                  "Semester IV",
                  "Semester V",
                  "Semester VI",
                  "Semester VII",
                  "Semester VIII",
                  "Other",
                ]}
              />

              <Field
                {...fieldProps}
                label="Student ID / PRN"
                name="studentId"
                value={form.studentId}
                placeholder="Enter student ID"
              />
            </div>
          </section>

          {/* Contact information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FaMapMarkerAlt className="text-lg" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Contact Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your address and location.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  disabled={!editing || saving}
                  className={`${inputClass} resize-y disabled:cursor-not-allowed disabled:opacity-70`}
                />
              </div>

              <Field
                {...fieldProps}
                label="City"
                name="city"
                value={form.city}
                placeholder="Enter city"
              />

              <Field
                {...fieldProps}
                label="State"
                name="state"
                value={form.state}
                placeholder="Enter state"
              />

              <Field
                {...fieldProps}
                label="Country"
                name="country"
                value={form.country}
                placeholder="Enter country"
              />
            </div>
          </section>

          {/* Save and cancel buttons */}
          {editing && (
            <div className="sticky bottom-4 z-10 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl backdrop-blur sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-60"
              >
                <FaTimes />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-slate-600">
          Your profile information is associated with your StudyMate AI account.
        </p>
      </div>
    </AppLayout>
  );
}

export default Profile;
