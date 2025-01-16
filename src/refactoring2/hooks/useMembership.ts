import { useEffect, useState } from 'react';
import { Membership } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import { usePreservedCallback } from './usePreservedCallback';

export const useMemberships = (initialMemberships: Membership[] = []) => {
  const { getItem, setItem } = useLocalStorage();

  const [memberships, setMemberships] = useState<Membership[]>(
    getItem('memberships') || initialMemberships,
  );

  useEffect(() => {
    setItem('memberships', memberships);
  }, [memberships]);

  const addMembership = usePreservedCallback((membership: Membership) => {
    setMemberships((prev) => {
      const exist = prev.some((current) => current.code === membership.code);
      return exist ? prev : [...prev, membership];
    });
  });

  return {
    memberships,
    addMembership,
  };
};
