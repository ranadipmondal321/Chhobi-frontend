import { useState } from "react";
import { User, Mail, Lock, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { API_URL } from "../lib/api";

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-[#232323] border border-[#333] rounded-2xl p-6 md:p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-[#e50914]/10 p-2 rounded-full">
        <Icon className="w-5 h-5 text-[#e50914]" />
      </div>
      <h2 className="text-white font-bold text-lg">{title}</h2>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState({ username: false, email: false, password: false, delete: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const apiCall = async (url, body, method = "PUT") => {
    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const handleUpdateUsername = async () => {
    if (!username.trim() || username === user?.username) return;
    setLoading((l) => ({ ...l, username: true }));
    const data = await apiCall("/user/update-username", { username });
    if (data.user) { setUser(data.user); toast.success(data.message); }
    else toast.error(data.message);
    setLoading((l) => ({ ...l, username: false }));
  };

  const handleUpdateEmail = async () => {
    if (!email.trim() || email === user?.email) return;
    setLoading((l) => ({ ...l, email: true }));
    const data = await apiCall("/user/update-email", { email });
    if (data.user) { setUser(data.user); toast.success(data.message); }
    else toast.error(data.message);
    setLoading((l) => ({ ...l, email: false }));
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return;
    if (passwords.new !== passwords.confirm) { toast.error("New passwords don't match."); return; }
    if (passwords.new.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setLoading((l) => ({ ...l, password: true }));
    const data = await apiCall("/user/update-password", {
      currentPassword: passwords.current,
      newPassword: passwords.new,
    });
    if (data.message === "Password updated successfully.") {
      toast.success(data.message);
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      toast.error(data.message);
    }
    setLoading((l) => ({ ...l, password: false }));
  };

  const handleDeleteAccount = async () => {
    setLoading((l) => ({ ...l, delete: true }));
    const res = await fetch(`${API_URL}/user/delete-account`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      await logout();
      navigate("/");
    } else {
      toast.error(data.message);
    }
    setLoading((l) => ({ ...l, delete: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-4 sm:px-6 md:px-16 py-12 text-white">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Settings</h1>
        <p className="text-[#888] text-sm">Manage your account details and preferences.</p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <Section icon={User} title="Change Username">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-[#aaa]">New Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm"
            />
            <button
              onClick={handleUpdateUsername}
              disabled={loading.username || username === user?.username}
              className="self-start bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading.username ? "Saving..." : "Save Username"}
            </button>
          </div>
        </Section>

        <Section icon={Mail} title="Change Email">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-[#aaa]">New Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm"
            />
            <button
              onClick={handleUpdateEmail}
              disabled={loading.email || email === user?.email}
              className="self-start bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading.email ? "Saving..." : "Save Email"}
            </button>
          </div>
        </Section>

        <Section icon={Lock} title="Change Password">
          <div className="flex flex-col gap-3">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password", key: "new" },
              { label: "Confirm New Password", key: "confirm" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-sm text-[#aaa] mb-1 block">{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                  className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm"
                />
              </div>
            ))}
            <button
              onClick={handleUpdatePassword}
              disabled={loading.password}
              className="self-start bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading.password ? "Updating..." : "Update Password"}
            </button>
          </div>
        </Section>

        <Section icon={Trash2} title="Delete Account">
          <p className="text-[#888] text-sm mb-4">
            Permanently delete your account and all saved data. This action cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-transparent border border-red-600 text-red-500 px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-600 hover:text-white transition"
            >
              Delete My Account
            </button>
          ) : (
            <div className="bg-[#181818] border border-red-600/40 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-white text-sm font-semibold">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading.delete}
                  className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading.delete ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-[#333] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#444] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

export default Settings;
