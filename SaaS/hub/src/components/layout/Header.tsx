import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getToolById } from '@/data/tools';

interface HeaderProps {
  lang: 'ko' | 'ja';
  dictionary: any;
}

export default function Header({ lang, dictionary }: HeaderProps) {
  const router = useRouter();
  
  const handleLanguageChange = (newLang: 'ko' | 'ja') => {
    // 언어 변경 시 해당 언어 경로로 이동
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/(ko|ja)/, );
    router.push(newPath);
  };

  return (
    <header className=sticky
