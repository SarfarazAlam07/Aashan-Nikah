'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiBookOpen, 
  FiSend, 
  FiHeart, 
  FiClock,
  FiMessageSquare,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import { FaMosque, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Advice {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

export default function MuftiAdvicePage() {
  const router = useRouter();
  const [advice, setAdvice] = useState('');
  const [adviceList, setAdviceList] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsed = JSON.parse(userData);
    setUser(parsed);
    
    if (parsed.role !== 'MUFTI') {
      toast.error('Access Denied');
      router.push('/user/dashboard');
      return;
    }
    
    fetchAdvice();
  }, [router]);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      // Load from localStorage for demo
      const saved = localStorage.getItem('mufti_advice');
      if (saved) {
        setAdviceList(JSON.parse(saved));
      } else {
        // Default advice
        setAdviceList([
          {
            id: '1',
            content: 'The best among you are those who have the best manners and character.',
            author: 'Prophet Muhammad (PBUH)',
            createdAt: new Date().toISOString(),
            likes: 45
          },
          {
            id: '2',
            content: 'Marriage is half of faith. Seek the other half in fear of Allah.',
            author: 'Islamic Teaching',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            likes: 32
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAdvice = () => {
    if (!advice.trim()) {
      toast.error('Please write some advice');
      return;
    }

    const newAdvice: Advice = {
      id: Date.now().toString(),
      content: advice,
      author: user?.name || 'Mufti',
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const updated = [newAdvice, ...adviceList];
    setAdviceList(updated);
    localStorage.setItem('mufti_advice', JSON.stringify(updated));
    
    toast.success('Islamic advice posted!');
    setAdvice('');
  };

  const handleLike = (id: string) => {
    const updated = adviceList.map(item => 
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    );
    setAdviceList(updated);
    localStorage.setItem('mufti_advice', JSON.stringify(updated));
    toast.success('Barakallah!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FiBookOpen className="text-amber-500 text-xl" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Islamic Advice
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Share Islamic guidance with the community
        </p>
      </div>

      {/* Post Advice Card */}
      <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div className="flex-1">
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="Share Islamic advice, hadith, or guidance..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handlePostAdvice}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition"
              >
                <FiSend size={14} />
                Post Advice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advice List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <FaMosque className="text-amber-500" size={18} />
          Recent Islamic Advice
        </h2>

        {adviceList.length === 0 ? (
          <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <FiBookOpen className="text-3xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No advice posted yet</p>
            <p className="text-xs text-gray-400 mt-1">Share your first Islamic advice above</p>
          </div>
        ) : (
          adviceList.map((item) => (
            <div key={item.id} className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <FaStar size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-white text-sm leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiUser size={12} />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1 hover:text-amber-500 transition"
                    >
                      <FiHeart size={12} />
                      {item.likes} likes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Islamic Quote Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <FiMessageSquare className="text-amber-500" size={18} />
          <h3 className="font-semibold text-gray-800 dark:text-white">Daily Reminder</h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed">
          "The most complete believer in faith is the one with the best character, 
          and the best of you are the best to their women."
        </p>
        <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
          — Prophet Muhammad (PBUH) | Tirmidhi
        </p>
      </div>
    </div>
  );
}