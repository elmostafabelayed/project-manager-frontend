import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

import Login    from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import ClientDashboard   from '../pages/client/Dashboard'
import CreateProject     from '../pages/client/CreateProject'
import ProjectProposals  from '../pages/client/ProjectProposals'
import MyProjects        from '../pages/client/MyProjects'

import BrowseProjects from '../pages/freelancer/BrowseProjects'
import MyProposals    from '../pages/freelancer/MyProposals'
import SubmitProposal from '../pages/freelancer/SubmitProposal'
import FreelancerDash from '../pages/freelancer/Dashboard'

import Chat     from '../pages/shared/Chat'
import Profile  from '../pages/shared/Profile'
import AboutUs  from '../pages/shared/AboutUs'
import Contact  from '../pages/shared/Contact'
import Landing  from '../pages/Landing'
import Review   from '../pages/shared/Review'

import AdminDashboard   from '../pages/admin/Dashboard'
import ManageUsers      from '../pages/admin/ManageUsers'
import ManageProjects   from '../pages/admin/ManageProjects'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<Landing />} />
      <Route path="/auth/login"    element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      {/* Client */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute allowedRoles={['1']}>
          <ClientDashboard />
        </ProtectedRoute>
      }/>
      <Route path="/client/create-project" element={
        <ProtectedRoute allowedRoles={['1']}>
          <CreateProject />
        </ProtectedRoute>
      }/>
      <Route path="/client/projects/:id/proposals" element={
        <ProtectedRoute allowedRoles={['1']}>
          <ProjectProposals />
        </ProtectedRoute>
      }/>
      <Route path="/client/my-projects" element={
        <ProtectedRoute allowedRoles={['1']}>
          <MyProjects />
        </ProtectedRoute>
      }/>

      {/* Freelancer */}
      <Route path="/freelancer/browse-projects" element={
        <ProtectedRoute allowedRoles={['2']}>
          <BrowseProjects />
        </ProtectedRoute>
      }/>
      <Route path="/freelancer/my-proposals" element={
        <ProtectedRoute allowedRoles={['2']}>
          <MyProposals />
        </ProtectedRoute>
      }/>
      <Route path="/freelancer/submit-proposal/:projectId" element={
        <ProtectedRoute allowedRoles={['2']}>
          <SubmitProposal />
        </ProtectedRoute>
      }/>
      <Route path="/freelancer/dashboard" element={
        <ProtectedRoute allowedRoles={['2']}>
          <FreelancerDash />
        </ProtectedRoute>
      }/>

      {/* Shared */}
      <Route path="/shared/chat" element={
        <ProtectedRoute allowedRoles={['1','2','3']}>
          <Chat />
        </ProtectedRoute>
      }/>
      <Route path="/shared/profile" element={
        <ProtectedRoute allowedRoles={['1','2','3']}>
          <Profile />
        </ProtectedRoute>
      }/>
      <Route path="/shared/profile/:id" element={
        <ProtectedRoute allowedRoles={['1','2','3']}>
          <Profile />
        </ProtectedRoute>
      }/>

      <Route path="/shared/aboutUs" element={<AboutUs />} />
      <Route path="/shared/contact" element={<Contact />} />
      <Route path="/shared/review" element={<Review />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['3']}>
          <AdminDashboard />
        </ProtectedRoute>
      }/>
      <Route path="/admin/manage-users" element={
        <ProtectedRoute allowedRoles={['3']}>
          <ManageUsers />
        </ProtectedRoute>
      }/>
      <Route path="/admin/manage-projects" element={
        <ProtectedRoute allowedRoles={['3']}>
          <ManageProjects />
        </ProtectedRoute>
      }/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
