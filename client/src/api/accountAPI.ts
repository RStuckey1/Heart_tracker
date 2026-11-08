import Auth from "../utils/auth";

export interface AccountProfile {
  id: number;
  username: string;
  birthday: string | null;
  age: number | null;
}

export interface AccountSettingsInput {
  username: string;
  birthday: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateAccountSettings = async (
  settings: AccountSettingsInput,
): Promise<AccountProfile> => {
  const response = await fetch("/api/user/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Auth.getToken()}`,
    },
    body: JSON.stringify(settings),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Could not update settings (${response.status})`);
  }
  return data.user as AccountProfile;
};
