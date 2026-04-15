import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import Navbar from '../../components/Navbar';
import profileService from '../../services/profileService';
import skillService from '../../services/skillService';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [userData, setUserData] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const isFreelancer = userData?.role_id == 2 || userData?.role?.name?.toLowerCase() === 'freelancer';

  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    hourly_rate: 0
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let profileResponse;
        const effectiveId = id || currentUser?.id;
        const isSelf = !id || id == currentUser?.id;
        setIsEditMode(isSelf);

        if (isSelf) {
          profileResponse = await profileService.getProfile();
        } else {
          profileResponse = await profileService.getPublicProfile(id);
        }

        setUserData(profileResponse);
        
        // Fetch global skills only if we might need to edit them (self mode)
        if (isSelf) {
          const skillsResponse = await skillService.getAllSkills();
          setAllSkills(skillsResponse);
        }
        
        // Populate form
        setProfileForm({
          name: profileResponse.name || '',
          title: profileResponse.profile?.title || '',
          bio: profileResponse.profile?.bio || '',
          location: profileResponse.profile?.location || '',
          hourly_rate: profileResponse.profile?.hourly_rate || 0
        });
        
        // Populate selected skills
        if (profileResponse.skills) {
          setSelectedSkills(profileResponse.skills.map(s => s.id));
        }

      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId) 
        : [...prev, skillId]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const savePromises = [profileService.updateProfile(profileForm)];
      
      // Only sync skills if the user is a freelancer
      if (isFreelancer) {
        savePromises.push(skillService.syncUserSkills(selectedSkills));
      }

      const results = await Promise.all(savePromises);
      const updateResponse = results[0];
      
      if (updateResponse.user) {
        dispatch(updateUser(updateResponse.user));
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="cl-loading-state p-5 text-center"><div className="cl-spinner"></div><p>Loading profile...</p></div>;

  return (
    <div className="bg-background min-vh-100">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <header className="profile-header">
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.name}&background=fff&color=185fa5`} 
              alt="Avatar" 
              className="profile-avatar-large"
            />
            <div className="profile-header-info">
              <h1>{userData.name}</h1>
              <p>{userData.role?.name || (userData.role_id === 1 ? 'Client' : 'Freelancer')} Account {isEditMode && `• ${userData.email}`}</p>
              {isEditMode && <span className="badge bg-secondary">Owner View</span>}
            </div>
          </header>

          <div className="profile-body">
            {isEditMode ? (
              <form onSubmit={handleSaveProfile}>
                {/* Basic Information Section */}
                <section className="profile-section">
                  <h2>Basic Information</h2>
                  <div className="profile-form-grid">
                    <div className="form-group mb-3">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        value={profileForm.name} 
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                      <small className="text-muted">This will be shown on your profile.</small>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={userData.email} 
                        disabled 
                        readOnly
                      />
                      <small className="text-muted">Email is managed in account settings.</small>
                    </div>
                  </div>
                </section>

                {/* Professional Details - Only for Freelancers */}
                {isFreelancer && (
                  <section className="profile-section">
                    <h2>Professional Details</h2>
                    <div className="profile-form-grid">
                      <div className="form-group mb-3">
                        <label className="form-label">Professional Title</label>
                        <input 
                          type="text" 
                          name="title" 
                          className="form-control" 
                          value={profileForm.title} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Senior Full Stack Developer"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">Location</label>
                        <input 
                          type="text" 
                          name="location" 
                          className="form-control" 
                          value={profileForm.location} 
                          onChange={handleInputChange}
                          placeholder="e.g. Casablanca, Morocco"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">Hourly Rate ($)</label>
                        <input 
                          type="number" 
                          name="hourly_rate" 
                          className="form-control" 
                          value={profileForm.hourly_rate} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Bio / Overview</label>
                      <textarea 
                        name="bio" 
                        className="form-control" 
                        rows="5" 
                        value={profileForm.bio} 
                        onChange={handleInputChange}
                        placeholder="Tell us about your experience and skills..."
                      ></textarea>
                    </div>
                  </section>
                )}

                {isFreelancer && (
                  <section className="profile-section">
                    <h2>Skills & Expertise</h2>
                    <p className="text-muted small mb-3">Select the skills that match your expertise.</p>
                    <div className="skills-manager">
                      {allSkills.map(skill => (
                        <span 
                          key={skill.id} 
                          className={`skill-tag clickable ${selectedSkills.includes(skill.id) ? 'selected' : ''}`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          {skill.name}
                          {selectedSkills.includes(skill.id) && <span>✓</span>}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-4 text-end">
                  <button 
                    type="submit" 
                    className="cl-btn-primary px-5 py-2"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="public-profile-view">
                {isFreelancer && (
                  <>
                    <section className="profile-section">
                      <h2>Professional Overview</h2>
                      <div className="mb-4">
                        <h4 className="fw-bold">{userData.profile?.title || "No title provided"}</h4>
                        <p className="text-muted">
                          <i className="bi bi-geo-alt"></i> {userData.profile?.location || "Unknown Location"}
                        </p>
                        <div className="h5 text-primary fw-bold">
                          Rate: ${userData.profile?.hourly_rate || '0'}/hr
                        </div>
                      </div>
                      <div className="bio-box p-3 bg-light rounded-3">
                        <p style={{ whiteSpace: 'pre-wrap' }}>
                          {userData.profile?.bio || "This user hasn't added a bio yet."}
                        </p>
                      </div>
                    </section>

                    <section className="profile-section">
                      <h2>Expertise</h2>
                      <div className="skills-manager">
                        {userData.skills?.length > 0 ? (
                          userData.skills.map(skill => (
                            <span key={skill.id} className="skill-tag selected">
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-muted">No specific skills listed.</p>
                        )}
                      </div>
                    </section>
                  </>
                )}

                <div className="mt-4 text-center">
                   <button className="cl-btn-primary" onClick={() => navigate('/shared/chat')}>
                      Contact {userData.name.split(' ')[0]}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
