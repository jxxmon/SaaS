'use client';

import React, { useState } from 'react';
import { UserProfileFormData } from '@/types/settings';
import TextInput from '../forms/TextInput';
import AvatarUploader from '../forms/AvatarUploader';
import SectionHeader from '../forms/SectionHeader';
import SaveButton from '../forms/SaveButton';
import PasswordChangeForm from '../forms/PasswordChangeForm';
import DeleteAccountModal from '../modals/DeleteAccountModal';

interface ProfileSettingsProps {
  initialData: UserProfileFormData;
  onSave: (data: UserProfileFormData) => void;
}

const getInitials = (firstName: string, lastName: string) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '??';
};

export default function ProfileSettings({
  initialData,
  onSave,
}: ProfileSettingsProps) {
  const [formData, setFormData] = useState<UserProfileFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleChange = (field: keyof UserProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (file: File) => {
    // Convert file to URL for preview
    const url = URL.createObjectURL(file);
    handleChange('avatar', url);
    console.log('Avatar upload:', file.name);
  };

  const handleAvatarRemove = () => {
    handleChange('avatar', '');
    console.log('Avatar removed');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile:', formData);
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log('Password change requested:', {
      currentPassword: '***',
      newPassword: '***',
    });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsPasswordModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    console.log('Account deletion confirmed');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <SectionHeader
          title="Profile Information"
          description="Update your personal information and how others see you on the platform."
          icon="👤"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="md:col-span-2 flex justify-center mb-4">
            <AvatarUploader
              currentAvatar={formData.avatar}
              onUpload={handleAvatarUpload}
              onRemove={handleAvatarRemove}
              userName={getInitials(formData.firstName, formData.lastName)}
            />
          </div>

          {/* First Name */}
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            placeholder="Enter your first name"
          />

          {/* Last Name */}
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            placeholder="Enter your last name"
          />

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us a little about yourself"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <SectionHeader
          title="Contact Information"
          description="Manage your contact details and location."
          icon="📧"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <TextInput
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            type="email"
            placeholder="your@email.com"
          />

          {/* Phone */}
          <TextInput
            label="Phone Number"
            value={formData.phone || ''}
            onChange={(value) => handleChange('phone', value)}
            type="tel"
            placeholder="+1 (555) 000-0000"
          />

          {/* Location */}
          <TextInput
            label="Location"
            value={formData.location || ''}
            onChange={(value) => handleChange('location', value)}
            placeholder="City, Country"
          />

          {/* Website */}
          <TextInput
            label="Personal Website"
            value={formData.website || ''}
            onChange={(value) => handleChange('website', value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </section>

      {/* Social Links Section */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <SectionHeader
          title="Social Links"
          description="Connect your social media profiles."
          icon="🔗"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub */}
          <TextInput
            label="GitHub"
            value={formData.github || ''}
            onChange={(value) => handleChange('github', value)}
            placeholder="https://github.com/username"
          />

          {/* LinkedIn */}
          <TextInput
            label="LinkedIn"
            value={formData.linkedin || ''}
            onChange={(value) => handleChange('linkedin', value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <SectionHeader
          title="Security"
          description="Manage your account security settings."
          icon="🔒"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update your password to keep your account secure
              </p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 p-6">
        <SectionHeader
          title="Danger Zone"
          description="Irreversible and destructive actions."
          icon="⚠️"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-200">
                Delete Account
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <SaveButton
          onClick={handleSave}
          loading={isSaving}
          label="Save Changes"
        />
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <PasswordChangeForm
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
        />
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <DeleteAccountModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
}
