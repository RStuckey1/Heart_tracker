import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { updateAccountSettings } from "../api/accountAPI";
import { useAuth } from "../context/useAuth";
import "../CSS/Settings.css";

const today = new Date().toISOString().slice(0, 10);

const Settings = () => {
  const { User, updateUser, loading } = useAuth();
  const [username, setUsername] = useState(User?.username ?? "");
  const [birthday, setBirthday] = useState(User?.birthday ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (User) {
      setUsername(User.username);
      setBirthday(User.birthday ?? "");
    }
  }, [User]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage("The new password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateAccountSettings({
        username,
        birthday,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      updateUser(updatedUser);
      setUsername(updatedUser.username);
      setBirthday(updatedUser.birthday ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your account settings have been saved.");
    } catch (error) {
      console.error("Could not save account settings:", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not save your settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="settings-page">
      <p className="eyebrow">Account preferences</p>
      <h1 className="page-title">Settings</h1>
      <p className="page-description">Update the details associated with your Heart Tracker account.</p>

      {loading ? (
        <p className="settings-loading" role="status">Loading your settings…</p>
      ) : (
      <form className="settings-card card" onSubmit={handleSubmit}>
        <section className="settings-section" aria-labelledby="profile-details-title">
          <div className="settings-section-heading">
            <h2 id="profile-details-title">Profile details</h2>
            <p>Your age is calculated from your birthday and updates automatically.</p>
          </div>
          <div className="settings-fields">
            <div className="form-group">
              <label htmlFor="settings-username">Username</label>
              <input
                className="form-input"
                id="settings-username"
                type="text"
                autoComplete="username"
                maxLength={50}
                value={username}
                required
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="settings-birthday">Birthday</label>
              <input
                className="form-input"
                id="settings-birthday"
                type="date"
                max={today}
                value={birthday}
                required
                onChange={(event) => setBirthday(event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="password-title">
          <div className="settings-section-heading">
            <h2 id="password-title">Change password</h2>
            <p>Leave these fields blank if you do not want to change your password.</p>
          </div>
          <div className="settings-fields">
            <div className="form-group settings-field-full">
              <label htmlFor="current-password">Current password</label>
              <input
                className="form-input"
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                required={Boolean(newPassword)}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <input
                className="form-input"
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                className="form-input"
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                value={confirmPassword}
                required={Boolean(newPassword)}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>
        </section>

        {message && <p className="settings-message" role="status">{message}</p>}
        {errorMessage && <p className="settings-error" role="alert">{errorMessage}</p>}

        <div className="settings-actions">
          <Link className="button button-secondary" to="/Landing">Cancel</Link>
          <button className="button" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
      )}
    </section>
  );
};

export default Settings;
