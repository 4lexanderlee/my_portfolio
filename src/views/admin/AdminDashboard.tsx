import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import type { AdminSection } from '../../types';

// ── Lazy section imports ───────────────────────────────────────────────────
import ProfileSection from './sections/ProfileSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import CertificationsSection from './sections/CertificationsSection';
import EducationSection from './sections/EducationSection';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':        return <ProfileSection />;
      case 'experience':     return <ExperienceSection />;
      case 'projects':       return <ProjectsSection />;
      case 'skills':         return <SkillsSection />;
      case 'certifications': return <CertificationsSection />;
      case 'education':      return <EducationSection />;
      default:               return null;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminDashboard;
