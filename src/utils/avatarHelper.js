export const getAvatarUrl = (user) => {
  if (user?.profile?.profile_picture) {
    const pic = user.profile.profile_picture;
    if (pic.startsWith('http://') || pic.startsWith('https://')) {
      return pic;
    }
    return `http://127.0.0.1:8000/storage/${pic}?t=${new Date().getTime()}`;
  }
  
  const name = user?.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=185fa5&color=fff&size=128`;
};
