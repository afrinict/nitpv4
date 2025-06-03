import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '../../../shared/schema';

interface MemberContextType {
  member: Member | null;
  setMember: (member: Member | null) => void;
  loading: boolean;
}

const MemberContext = createContext<MemberContextType>({
  member: null,
  setMember: () => {},
  loading: true
});

export const useMember = () => useContext(MemberContext);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch member data from API
    setLoading(false);
  }, []);

  return (
    <MemberContext.Provider value={{ member, setMember, loading }}>
      {children}
    </MemberContext.Provider>
  );
}; 