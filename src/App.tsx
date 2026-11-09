import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HeaderNav } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PrincipalProfileView } from './components/PrincipalProfileView';
import { TeachersView } from './components/TeachersView';
import { AttendanceView } from './components/AttendanceView';
import { GradesView } from './components/GradesView';
import { LearningMaterialsView } from './components/LearningMaterialsView';
import { AssignmentsView } from './components/AssignmentsView';
import { EduGame } from './components/EduGame';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ForumView } from './components/ForumView';
import { SyncSettingsModal } from './components/SyncSettingsModal';
import { AuthModal } from './components/AuthModal';

const MainAppLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [storageTick, setStorageTick] = useState(0);

  // Storage event listener to keep views in sync
  useEffect(() => {
    const handleStorageUpdate = () => {
      setStorageTick(t => t + 1);
    };
    window.addEventListener('siakad_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('siakad_storage_updated', handleStorageUpdate);
  }, []);

  const handleOpenSyncFromSidebar = (view: string) => {
    if (view === 'sync') {
      setSyncModalOpen(true);
    } else {
      setActiveView(view);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveView} key={storageTick} />;
      case 'principal':
        return <PrincipalProfileView key={storageTick} />;
      case 'teachers':
        return <TeachersView key={storageTick} />;
      case 'attendance':
        return <AttendanceView key={storageTick} />;
      case 'grades':
        return <GradesView key={storageTick} />;
      case 'materials':
        return <LearningMaterialsView key={storageTick} />;
      case 'assignments':
        return <AssignmentsView key={storageTick} />;
      case 'games':
        return <EduGame key={storageTick} />;
      case 'announcements':
        return <AnnouncementsView key={storageTick} />;
      case 'forum':
        return <ForumView key={storageTick} />;
      default:
        return <DashboardView onNavigate={setActiveView} key={storageTick} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 selection:bg-red-500 selection:text-white">
      {/* Top Header Navigation */}
      <HeaderNav
        onOpenSync={() => setSyncModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={handleOpenSyncFromSidebar}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Workspace Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <SyncSettingsModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}
