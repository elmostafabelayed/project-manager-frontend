import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateUser } from '../../store/slices/authSlice';
import Navbar from '../../components/Navbar';
import profileService from '../../services/profileService';
import skillService from '../../services/skillService';
import { FormInput, FormTextArea } from '../../components/common/FormComponents';
import toast from 'react-hot-toast';
import './Profile.css';

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  title: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  hourly_rate: z.coerce.number().min(0, "Rate cannot be negative"),
  bio: z.string().optional().or(z.literal('')),
});

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [userData, setUserData] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const isFreelancer = userData?.role_id == 2 || userData?.role?.name?.toLowerCase() === 'freelancer';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const effectiveId = id || currentUser?.id;
        const isSelf = !id || id == currentUser?.id;
        setIsEditMode(isSelf);

        let profileResponse;
        if (isSelf) {
          profileResponse = await profileService.getProfile();
        } else {
          profileResponse = await profileService.getPublicProfile(id);
        }

        setUserData(profileResponse);
        
        if (isSelf) {
          const skillsResponse = await skillService.getAllSkills();
          setAllSkills(skillsResponse);
        }
        
        // Reset form with fetched data
        reset({
          name: profileResponse.name || '',
          title: profileResponse.profile?.title || '',
          bio: profileResponse.profile?.bio || '',
          location: profileResponse.profile?.location || '',
          hourly_rate: profileResponse.profile?.hourly_rate || 0
        });
        
        if (profileResponse.skills) {
          setSelectedSkills(profileResponse.skills.map(s => s.id));
        }

      } catch (error) {
        console.error("Failed to load profile data:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, reset]);

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId) 
        : [...prev, skillId]
    );
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const savePromises = [profileService.updateProfile(data)];
      
      if (isFreelancer) {
        savePromises.push(skillService.syncUserSkills(selectedSkills));
      }

      const results = await Promise.all(savePromises);
      const updateResponse = results[0];
      
      if (updateResponse.user) {
        dispatch(updateUser(updateResponse.user));
        setUserData(prev => ({ ...prev, ...updateResponse.user }));
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        Object.keys(backendErrors).forEach((key) => {
          setError(key, { type: "manual", message: backendErrors[key][0] });
        });
      } else {
        toast.error("Error saving profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="cl-loading-state p-5 text-center"><div className="cl-spinner"></div><p>Loading profile...</p></div>;

  return (
    <div className="bg-background min-vh-100 mt-5">
      <Navbar />
      <div className="profile-container mt-4">
        <Link 
          to={currentUser?.role_id == 1 ? '/client/dashboard' : currentUser?.role_id == 2 ? '/freelancer/dashboard' : '/admin/dashboard'} 
          className="back-link mb-3 d-inline-block text-decoration-none"
        >
          ← Back to Dashboard
        </Link>
        <div className="profile-card shadow-sm rounded-4 overflow-hidden bg-white">
          <header className="profile-header p-4 d-flex align-items-center gap-4 border-bottom">
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.name}&background=185fa5&color=fff&size=128`} 
              alt="Avatar" 
              className="profile-avatar-large rounded-circle border border-4 border-white shadow-sm"
            />
            <div className="profile-header-info">
              <h1 className="h2 fw-bold mb-1">{userData.name}</h1>
              <p className="text-muted mb-2">
                {userData.role?.name || (userData.role_id === 1 ? 'Client' : 'Freelancer')} Account 
                {isEditMode && <span className="ms-2 badge bg-light text-dark border">Owner View</span>}
              </p>
              {isEditMode && <p className="small text-muted">{userData.email}</p>}
            </div>
          </header>

          <div className="profile-body p-4">
            {isEditMode ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <section className="profile-section mb-5">
                  <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">Basic Information</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput 
                        label="Full Name" 
                        name="name"
                        placeholder="Your full name"
                        register={register}
                        error={errors.name}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold small text-muted">Email Address (Read-only)</label>
                        <input type="email" className="form-control bg-light" value={userData.email} disabled readOnly />
                      </div>
                    </div>
                  </div>
                </section>

                {isFreelancer && (
                  <>
                    <section className="profile-section mb-5">
                      <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">Professional Details</h2>
                      <div className="row">
                        <div className="col-md-6">
                          <FormInput 
                            label="Professional Title" 
                            name="title" 
                            placeholder="e.g. Senior Full Stack Developer"
                            register={register}
                            error={errors.title}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormInput 
                            label="Location" 
                            name="location" 
                            placeholder="e.g. Casablanca, Morocco"
                            register={register}
                            error={errors.location}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormInput 
                            label="Hourly Rate ($)" 
                            name="hourly_rate" 
                            type="number"
                            register={register}
                            error={errors.hourly_rate}
                          />
                        </div>
                      </div>
                      <FormTextArea 
                        label="Bio / Overview" 
                        name="bio" 
                        rows={5} 
                        placeholder="Tell us about your experience and skills..."
                        register={register}
                        error={errors.bio}
                      />
                    </section>

                    <section className="profile-section mb-5">
                      <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">Skills & Expertise</h2>
                      {!selectedCategory ? (
                        <div className="category-selection-grid d-grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                          {[
                            'Design & creative',
                            'Developpement & tech',
                            'AI & emerging tech',
                            'Marketing',
                            'Writing & content',
                            'Admin & support'
                          ].map(cat => (
                            <div 
                              key={cat} 
                              className="category-card p-3 border rounded-3 text-center transition-all hover-shadow clickable bg-light"
                              onClick={() => setSelectedCategory(cat)}
                              style={{ transition: 'all 0.2s ease' }}
                            >
                              <div className="h2 mb-2">
                                {cat === 'Design & creative' && '🎨'}
                                {cat === 'Developpement & tech' && '💻'}
                                {cat === 'AI & emerging tech' && '🤖'}
                                {cat === 'Marketing' && '📈'}
                                {cat === 'Writing & content' && '✍️'}
                                {cat === 'Admin & support' && '🛠️'}
                              </div>
                              <div className="fw-bold small">{cat}</div>
                              <div className="text-muted" style={{ fontSize: '11px' }}>
                                {allSkills.filter(s => s.category === cat).length} skills
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="skills-editor border rounded-3 p-4 bg-light">
                          <div className="d-flex align-items-center mb-4">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-primary me-3"
                              onClick={() => setSelectedCategory(null)}
                            >
                              ← Back
                            </button>
                            <h4 className="h5 mb-0 fw-bold">{selectedCategory}</h4>
                          </div>
                          <div className="skills-manager d-flex flex-wrap gap-2">
                            {allSkills
                              .filter(skill => skill.category === selectedCategory)
                              .map(skill => (
                                <span 
                                  key={skill.id} 
                                  className={`skill-tag px-3 py-1 border rounded-pill clickable transition-all ${selectedSkills.includes(skill.id) ? 'bg-primary text-white border-primary' : 'bg-white text-dark hover-bg-light'}`}
                                  onClick={() => toggleSkill(skill.id)}
                                  style={{ cursor: 'pointer', fontSize: '14px' }}
                                >
                                  {skill.name}
                                  {selectedSkills.includes(skill.id) && <span className="ms-1">✓</span>}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedSkills.length > 0 && (
                        <div className="mt-4">
                          <h6 className="fw-bold mb-3">Selected Skills ({selectedSkills.length})</h6>
                          <div className="selected-skills-summary d-flex flex-wrap gap-2">
                            {allSkills
                              .filter(s => selectedSkills.includes(s.id))
                              .map(skill => (
                                <span key={skill.id} className="skill-tag px-3 py-1 bg-primary text-white rounded-pill d-flex align-items-center" style={{ fontSize: '13px' }}>
                                  {skill.name}
                                  <span className="ms-2 clickable" style={{ cursor: 'pointer' }} onClick={() => toggleSkill(skill.id)}>×</span>
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </section>
                  </>
                )}

                <div className="mt-5 pt-3 border-top text-end">
                  <button 
                    type="submit" 
                    className="premium-btn premium-btn-primary px-5 shadow-sm"
                    disabled={saving}
                  >
                    {saving ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="public-profile-view">
                {isFreelancer ? (
                  <>
                    <section className="profile-section mb-5">
                      <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">Professional Overview</h2>
                      <div className="mb-4">
                        <h3 className="h4 fw-bold text-dark mb-2">{userData.profile?.title || "Professional Freelancer"}</h3>
                        <div className="d-flex align-items-center gap-3 text-muted mb-3">
                          <span><i className="bi bi-geo-alt me-1"></i> {userData.profile?.location || "Remote"}</span>
                          <span className="fw-bold text-primary h5 mb-0">${userData.profile?.hourly_rate || '0'}/hr</span>
                        </div>
                        <div className="bio-box p-4 bg-light rounded-4 border">
                          <p className="mb-0 text-dark lh-base" style={{ whiteSpace: 'pre-wrap' }}>
                            {userData.profile?.bio || "This user hasn't added a bio yet."}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="profile-section">
                      <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">Expertise</h2>
                      <div className="skills-list d-flex flex-wrap gap-2">
                        {userData.skills?.length > 0 ? (
                          userData.skills.map(skill => (
                            <span key={skill.id} className="skill-tag px-3 py-1 bg-white border border-primary text-primary rounded-pill fw-medium" style={{ fontSize: '14px' }}>
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-muted italic">No specific skills listed.</p>
                        )}
                      </div>
                    </section>
                  </>
                ) : (
                   <section className="profile-section">
                      <h2 className="h4 fw-bold mb-4 border-start border-4 border-primary ps-3">About Client</h2>
                      <p className="text-muted">This is a client account on Jobsy.</p>
                   </section>
                )}

                <div className="mt-5 text-center">
                   <button className="premium-btn premium-btn-primary px-5 rounded-pill shadow" onClick={() => navigate('/shared/chat')}>
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
