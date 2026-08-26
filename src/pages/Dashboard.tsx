import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { OperationType, handleFirestoreError } from '../firebase/errors';
import { VIDEOS, COURSE_SECTIONS } from '../data/videos';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

interface VideoProgress {
  videoId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  lastOpenedAt?: string;
}

export default function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'video_progress'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const progressMap: Record<string, VideoProgress> = {};
        snapshot.forEach(doc => {
          const data = doc.data() as VideoProgress;
          progressMap[data.videoId] = data;
        });
        setProgressData(progressMap);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'video_progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser, userProfile, navigate]);

  if (loading || !userProfile) {
    return <div className="p-8 text-slate-500">Loading your progress...</div>;
  }

  // Calculate stats
  const totalVideos = VIDEOS.length;
  const completedVideos = VIDEOS.filter(v => progressData[v.id]?.status === 'completed');
  const completionPercentage = Math.round((completedVideos.length / totalVideos) * 100);

  // Find next video
  const lastOpened = (Object.values(progressData) as VideoProgress[])
    .filter(p => p.lastOpenedAt)
    .sort((a, b) => new Date(b.lastOpenedAt!).getTime() - new Date(a.lastOpenedAt!).getTime())[0];
  
  let nextVideo = VIDEOS[0];
  if (lastOpened && lastOpened.status !== 'completed') {
    nextVideo = VIDEOS.find(v => v.id === lastOpened.videoId) || nextVideo;
  } else {
    nextVideo = VIDEOS.find(v => progressData[v.id]?.status !== 'completed') || VIDEOS[VIDEOS.length - 1];
  }

  return (
    <div className="p-4 md:p-8 max-w-[1024px] mx-auto w-full space-y-6">
      
      <div className="w-full">
        {/* Welcome & Continue Card */}
        <div className="bg-[#3B82F6] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
            <p className="text-white/80 mb-8 max-w-md">You've completed {completedVideos.length} out of {totalVideos} lessons. Keep up the great work!</p>
            
            <button 
              onClick={() => navigate(`/learn?v=${nextVideo.id}`)}
              className="bg-white text-[#3B82F6] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors w-fit shadow-sm shadow-blue-200"
            >
              <PlayCircle className="w-5 h-5" />
              Continue Learning
            </button>
          </div>
          {/* Abstract circles */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/50 rounded-full blur-3xl"></div>
          <div className="absolute right-20 -top-10 w-40 h-40 bg-blue-400/30 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sections Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E2D9] shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight mb-6">Course Progress</h2>
          <div className="space-y-6">
            {COURSE_SECTIONS.map(section => {
              const sectionVideos = VIDEOS.filter(v => v.section === section);
              const completedInSection = sectionVideos.filter(v => progressData[v.id]?.status === 'completed').length;
              const percent = Math.round((completedInSection / sectionVideos.length) * 100) || 0;
              
              return (
                <div key={section}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{section}</span>
                    <span className="text-[10px] font-bold text-[#3B82F6]">{completedInSection}/{sectionVideos.length}</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#22C55E] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#E5E2D9] shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {completedVideos.length === 0 ? (
              <p className="text-[#64748B] text-sm">No completed lessons yet. Start learning!</p>
            ) : (
              completedVideos
                .sort((a, b) => new Date(progressData[b.id]?.completedAt || 0).getTime() - new Date(progressData[a.id]?.completedAt || 0).getTime())
                .slice(0, 5)
                .map(video => (
                  <div key={video.id} className="flex gap-3 items-start">
                    <div className="w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1E40AF] line-clamp-2">{video.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{video.section}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
