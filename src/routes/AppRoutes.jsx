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

import Chat    from '../pages/shared/Chat'
import Profile from '../pages/shared/Profile'
import Landing from '../pages/Landing'

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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
