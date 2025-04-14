
import React from 'react';
import { ClipboardList, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import { BarChart3 } from 'lucide-react';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = {
    totalQuizzes: 24,
    totalCategories: 8
  };

  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your content management system" 
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard
          title="Total Quiz"
          value={stats.totalQuizzes}
          icon={ClipboardList}
          color="#3b82f6" // Blue
          link={{
            url: "/quiz",
            text: "View all quizzes"
          }}
        />
        
        <InfoCard
          title="Total Category"
          value={stats.totalCategories}
          icon={Tag}
          color="#8b5cf6" // Purple
          link={{
            url: "/quiz-category",
            text: "View all categories"
          }}
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-card">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Panel</h2>
        <p className="text-gray-600">
          This is your central hub for managing quizzes, blog posts, and links. 
          Use the sidebar to navigate between different sections of the admin panel.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="font-medium mb-2">Quick Actions</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/quiz/new" className="text-admin-primary hover:underline">Create a new quiz</a>
              </li>
              <li>
                <a href="/blog/new" className="text-admin-primary hover:underline">Write a blog post</a>
              </li>
              <li>
                <a href="/links/new" className="text-admin-primary hover:underline">Add a new link</a>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="font-medium mb-2">Recent Activity</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>New quiz category added</li>
              <li>Blog post "Getting Started" published</li>
              <li>2 quizzes updated</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
