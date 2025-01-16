import { Membership } from '../../types';
import { useAsync } from './useAsync';
import { usePreservedCallback } from './usePreservedCallback';

export const useMemberships = () => {
  const { data: memberships, reRun } = useAsync({
    asyncFn: async () => {
      const result = await fetch('/memberships').then((res) => res.json());
      return result;
    },
  });

  const addMembership = usePreservedCallback(async (membership: Membership) => {
    await fetch('/memberships', {
      method: 'POST',
      body: JSON.stringify(membership),
    });
    reRun();
  });

  return {
    addMembership,
    memberships: memberships || [],
  };
};
