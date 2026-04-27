export const getAvatarUrl = (user) => {
  if (user?.profile?.profile_picture) {
    return `http://127.0.0.1:8000/storage/${user.profile.profile_picture}?t=${new Date().getTime()}`;
  }
  
  const name = user?.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=185fa5&color=fff&size=128`;
};
