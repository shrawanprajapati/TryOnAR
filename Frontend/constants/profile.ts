export const PROFILE_STORAGE_KEYS = {
  name: 'profile_name',
  email: 'profile_email',
  role: 'profile_role',
} as const;

export const DEFAULT_PROFILE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'AR Creator',
};
