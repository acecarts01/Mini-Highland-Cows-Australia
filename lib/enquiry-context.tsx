'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnimalProduct } from './site-config';

interface EnquiryContextType {
  enquiryList: AnimalProduct[];
  toggleEnquiry: (animal: AnimalProduct) => void;
  removeEnquiry: (id: string) => void;
  clearEnquiry: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  inspectedAnimal: AnimalProduct | null;
  setInspectedAnimal: (animal: AnimalProduct | null) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiryList, setEnquiryList] = useState<AnimalProduct[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('mhc-enquiry-basket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inspectedAnimal, setInspectedAnimal] = useState<AnimalProduct | null>(null);

  // Sync to localStorage whenever enquiryList changes
  useEffect(() => {
    try {
      localStorage.setItem('mhc-enquiry-basket', JSON.stringify(enquiryList));
    } catch (e) {
      console.warn('Could not save enquiry basket to localStorage', e);
    }
  }, [enquiryList]);

  const toggleEnquiry = (animal: AnimalProduct) => {
    setEnquiryList((prev) => {
      const exists = prev.some((a) => a.id === animal.id);
      if (exists) {
        return prev.filter((a) => a.id !== animal.id);
      } else {
        return [...prev, animal];
      }
    });
  };

  const removeEnquiry = (id: string) => {
    setEnquiryList((prev) => prev.filter((a) => a.id !== id));
  };

  const clearEnquiry = () => {
    setEnquiryList([]);
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiryList,
        toggleEnquiry,
        removeEnquiry,
        clearEnquiry,
        isDrawerOpen,
        setIsDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        inspectedAnimal,
        setInspectedAnimal,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
