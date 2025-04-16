import { Routes, Route } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import EmailVerification from './_auth/forms/EmailVerification';
import VerifyEmail from './_auth/forms/VerifyEmail';
import RootLayout from './_root/RootLayout';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import CleanImages from './pages/CleanImages';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}

        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
          <Route path='/verify-email' element={<EmailVerification />} />
          <Route path='/verify' element={<VerifyEmail />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/saved' element={<Saved/>}/>
          <Route path='/all-users' element={<AllUsers/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:id' element={<EditPost/>}/>
          <Route path='/post/:id' element={<PostDetails/>}/>
          <Route path='/profile/:id/*' element={<Profile/>}/>
          <Route path='/update-profile/:id/' element={<UpdateProfile/>}/>
          <Route path='/clean-images' element={<CleanImages/>}/>
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App