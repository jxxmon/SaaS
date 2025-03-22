/**
 * UserProfile Component
 * User profile display and editing component
 */

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  role: string;
}

export interface UserProfileProps {
  user: UserProfileData;
  onSave?: (updatedUser: UserProfileData) => void;
  editable?: boolean;
  className?: string;
}

export default function UserProfile({
  user,
  onSave,
  editable = true,
  className = '',
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfileData>({ ...user });

  const handleSave = () => {
    onSave?.(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={}>
      {/* Header */}
      <div className=bg-gradient-to-r
