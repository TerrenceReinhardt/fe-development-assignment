import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';
export default function App() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Navbar/><main className="mx-auto max-w-6xl px-4 py-10 sm:px-8"><Routes><Route path="/" element={<Home/>}/><Route path="/clubs" element={<Clubs/>}/><Route path="/clubs/:clubId" element={<ClubDetail/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Routes></main><footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-600">Campus Club Finder · Student Affairs</footer></div>;
}
