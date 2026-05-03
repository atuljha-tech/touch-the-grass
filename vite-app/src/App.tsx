import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HeroLayout from '@/layouts/HeroLayout'
import Explore from '@/pages/Explore'
import Profile from '@/pages/Profile'
import Projects from '@/pages/Projects'
import EventDetail from '@/pages/EventDetail'
import Judging from '@/pages/Judging'
import Community from '@/pages/Community'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroLayout />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/judging" element={<Judging />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  )
}
