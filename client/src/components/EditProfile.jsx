import { getUser, updateUser } from "@/redux/reducers/userSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    picture: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        picture: user.picture || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setProfileData((prev) => ({
        ...prev,
        picture: URL.createObjectURL(selected),
      }));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = null;

      if (file) {
        imageBase64 = await toBase64(file);
      }

      await dispatch(
        updateUser({
          name: profileData.name,
          phoneNumber: profileData.phoneNumber,
          image: imageBase64, // 👈 base64 string or null
        })
      ).unwrap();

      dispatch(getUser());
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.", error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Update Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {profileData.picture ? (
                <img
                  src={profileData.picture}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                  No Img
                </span>
              )}
            </div>
            <label className="cursor-pointer text-sm text-blue-600 hover:underline">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled // optional: usually users can't update their email
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
