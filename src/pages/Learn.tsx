import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, getDocs, setDoc, query, collection, where, deleteField } from 'firebase/firestore';
import { OperationType, handleFirestoreError } from '../firebase/errors';
import { VIDEOS, COURSE_SECTIONS, Video } from '../data/videos';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ListVideo, X, PlayCircle } from 'lucide-react';

export default function Learn() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('v') || VIDEOS[0].id;
  const currentVideo = VIDEOS.find(v => v.id === videoId) || VIDEOS[0];
  const currentIndex = VIDEOS.findIndex(v => v.id === currentVideo.id);
  
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'video_progress'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const map: Record<string, any> = {};
        snapshot.forEach(doc => {
          map[doc.data().videoId] = doc.data();
        });
        setProgressData(map);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'video_progress');
      }
    };
    fetchProgress();
  }, [currentUser]);

  // Mark as in-progress when opening a new video
  useEffect(() => {
    if (!currentUser || !currentVideo) return;
    
    const updateOpened = async () => {
      const current = progressData[currentVideo.id];
      if (current?.status === 'completed') return;

      try {
        const path = `video_progress/${currentUser.uid}_${currentVideo.id}`;
        await setDoc(doc(db, 'video_progress', `${currentUser.uid}_${currentVideo.id}`), {
          userId: currentUser.uid,
          videoId: currentVideo.id,
          status: 'in_progress',
          lastOpenedAt: new Date().toISOString()
        }, { merge: true });
        
        setProgressData(prev => ({
          ...prev,
          [currentVideo.id]: {
            ...prev[currentVideo.id],
            status: 'in_progress',
            lastOpenedAt: new Date().toISOString()
          }
        }));
      } catch (error) {
        // Ignoring silently for just opening, to not break experience
        console.error(error);
      }
    };
    updateOpened();
  }, [currentVideo, currentUser]);

  const handleMarkComplete = async () => {
    if (!currentUser || updating) return;
    setUpdating(true);
    
    const isCompleted = progressData[currentVideo.id]?.status === 'completed';
    const newStatus = isCompleted ? 'in_progress' : 'completed';
    const path = `video_progress/${currentUser.uid}_${currentVideo.id}`;
    
    try {
      await setDoc(doc(db, 'video_progress', `${currentUser.uid}_${currentVideo.id}`), {
        userId: currentUser.uid,
        videoId: currentVideo.id,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : deleteField(),
        lastOpenedAt: new Date().toISOString()
      }, { merge: true });
      
      setProgressData(prev => ({
        ...prev,
        [currentVideo.id]: {
          ...prev[currentVideo.id],
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
        }
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSearchParams({ v: VIDEOS[currentIndex - 1].id });
    }
  };

  const handleNext = () => {
    if (currentIndex < VIDEOS.length - 1) {
      setSearchParams({ v: VIDEOS[currentIndex + 1].id });
    }
  };

  const isCompleted = progressData[currentVideo.id]?.status === 'completed';

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto px-3 py-4 space-y-6">
      {COURSE_SECTIONS.map((section, sectionIndex) => {
        const sectionVideos = VIDEOS.filter(v => v.section === section);
        if (sectionVideos.length === 0) return null;
        
        return (
          <div key={section}>
            <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 px-3">
              {sectionIndex + 1}. {section}
            </h3>
            <div className="space-y-1">
              {sectionVideos.map(video => {
                const isActive = video.id === currentVideo.id;
                const completed = progressData[video.id]?.status === 'completed';
                return (
                  <button
                    key={video.id}
                    onClick={() => {
                      setSearchParams({ v: video.id });
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border ${
                      completed
                        ? 'bg-[#F0FDF4] border-[#DCFCE7]'
                        : isActive
                        ? 'bg-[#EFF6FF] border-[#DBEAFE]'
                        : 'border-transparent hover:bg-gray-50 opacity-60'
                    }`}
                  >
                    {completed ? (
                      <div className="w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#3B82F6] flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-[#CBD5E1] shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${
                        completed ? 'text-[#166534]' : isActive ? 'text-[#1E40AF]' : 'text-[#475569]'
                      }`}>
                        {String(video.lessonNumber).padStart(2, '0')} - {video.title}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );

  return (
    <div className="flex h-full bg-white relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[280px] border-r border-[#E5E2D9] h-full flex-shrink-0 bg-white">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-[#E5E2D9] transform transition-transform duration-300 lg:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#E5E2D9]">
          <h2 className="font-bold text-[#0F172A] tracking-tight">Course Contents</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-[#64748B] p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="h-[calc(100vh-65px)]">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#E5E2D9] px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-[#64748B]"
              onClick={() => setDrawerOpen(true)}
            >
              <ListVideo className="w-5 h-5" />
            </button>
            <div className="hidden lg:block h-4 w-px bg-gray-200"></div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">{String(currentVideo.lessonNumber).padStart(2, '0')} - {currentVideo.title}</h2>
              <p className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-wider">{currentVideo.section}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden md:block px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-semibold hover:border-gray-300"
            >
              Dashboard
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex flex-col gap-6">
          {window !== window.parent && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex items-start gap-3 shadow-sm">
              <div className="bg-amber-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold mb-1 text-amber-900">Preview Sandboxing Detected</p>
                <p className="font-medium text-amber-800/80">Streamtape restricts playback inside sandboxed environments. <strong className="text-amber-900 font-bold">Click the "Open in new tab" icon at the top right</strong> of this preview window to watch the videos.</p>
              </div>
            </div>
          )}

          <div className="aspect-video w-full bg-black rounded-2xl shadow-2xl overflow-hidden border-8 border-white">
            <iframe 
              src={currentVideo.embeddedLink} 
              className="w-full h-full border-0"
              allowFullScreen 
              allow="autoplay"
              scrolling="no"
              frameBorder="0"
              title={currentVideo.title}
            ></iframe>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E2D9] shadow-sm">
              <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Lesson Actions</h4>
              <button
                onClick={handleMarkComplete}
                disabled={updating}
                className={`w-full py-2.5 rounded-lg text-sm font-bold border transition-all ${
                  isCompleted 
                    ? 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]' 
                    : 'bg-[#3B82F6] text-white border-transparent shadow-sm shadow-blue-200 hover:bg-blue-600'
                }`}
              >
                {isCompleted ? 'Marked as Complete' : 'Mark Complete'}
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E2D9] shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Navigation</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1 py-2 bg-white rounded-lg text-xs font-bold text-[#475569] border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === VIDEOS.length - 1}
                    className="flex-1 py-2 bg-white rounded-lg text-xs font-bold text-[#475569] border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#EFF6FF] p-5 rounded-2xl border border-[#DBEAFE] shadow-sm flex flex-col justify-between">
              <h4 className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider">Next Up</h4>
              <p className="text-sm font-bold text-[#1E40AF]">
                {currentIndex < VIDEOS.length - 1 
                  ? `${String(VIDEOS[currentIndex + 1].lessonNumber).padStart(2, '0')} - ${VIDEOS[currentIndex + 1].title}`
                  : 'Course Complete'}
              </p>
              <button 
                onClick={handleNext}
                disabled={currentIndex === VIDEOS.length - 1}
                className="w-full mt-2 py-1.5 bg-white rounded-lg text-xs font-bold text-[#3B82F6] border border-[#DBEAFE] disabled:opacity-50"
              >
                Skip to Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
