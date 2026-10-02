import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))

const ClientDashboard = lazy(() => import('../pages/client/Dashboard'))
const CreateProject = lazy(() => import('../pages/client/CreateProject'))
const ProjectProposals = lazy(() => import('../pages/client/ProjectProposals'))
const MyProjects = lazy(() => import('../pages/client/MyProjects'))

const BrowseProjects = lazy(() => import('../pages/freelancer/BrowseProjects'))
const MyProposals = lazy(() => import('../pages/freelancer/MyProposals'))
const SubmitProposal = lazy(() => import('../pages/freelancer/SubmitProposal'))
const FreelancerDash = lazy(() => import('../pages/freelancer/Dashboard'))

const Chat = lazy(() => import('../pages/shared/Chat'))
const Profile = lazy(() => import('../pages/shared/Profile'))
const AboutUs = lazy(() => import('../pages/shared/AboutUs'))
const Contact = lazy(() => import('../pages/shared/Contact'))
const Landing = lazy(() => import('../pages/Landing'))
const Review = lazy(() => import('../pages/shared/Review'))

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'))
const ManageProjects = lazy(() => import('../pages/admin/ManageProjects'))
const Freelancers = lazy(() => import('../pages/shared/Freelancers'))
const Jobs = lazy(() => import('../pages/shared/Jobs'))

const ContactMessages = lazy(() => import('../pages/admin/ContactMessages'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" className="p-4 text-center">Loading…</div>}>
    <Routes>
      <Route path="/"            element={<Landing />} />
      <Route path="/auth/login"    element={<Login />} />
      <Route path="/auth/register" element={<Register />} />


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
      <Route path="/shared/freelancers" element={<Freelancers />} />
      <Route path="/shared/jobs" element={<Jobs />} />


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

      <Route path="/admin/contact-messages" element={<ProtectedRoute allowedRoles={['3']}><ContactMessages /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Suspense>
  )
}
