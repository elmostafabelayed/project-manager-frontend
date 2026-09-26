export const getAvatarUrl = (user) => {
  if (user?.profile?.profile_picture) {
    const pic = user.profile.profile_picture;
    if (pic.startsWith('http://') || pic.startsWith('https://')) {
      return pic;
    }

    const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${pic}?t=${new Date().getTime()}`;
  }
  
  const name = user?.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=185fa5&color=fff&size=128`;
};