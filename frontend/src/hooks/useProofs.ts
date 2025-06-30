
import { useQuery } from '@tanstack/react-query';

// Mock data for demonstration until backend is connected
const mockProofs = [
  {
    id: 'proof-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'pass',
    type: 'safety-property',
    metadata: {
      propertyId: 'PROP-001',
      startTs: new Date(Date.now() - 7200000).toISOString(),
      endTs: new Date(Date.now() - 3600000).toISOString()
    },
    hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
    size: 1024,
    validator: 'validator-01'
  },
  {
    id: 'proof-002',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'fail',
    type: 'liveness-property',
    metadata: {
      propertyId: 'PROP-002',
      startTs: new Date(Date.now() - 5400000).toISOString(),
      endTs: new Date(Date.now() - 1800000).toISOString()
    },
    hash: 'b2c3d4e5f6789012345678901234567890abcde',
    size: 2048,
    validator: 'validator-02'
  },
  {
    id: 'proof-003',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'pass',
    type: 'invariant-property',
    metadata: {
      propertyId: 'PROP-003',
      startTs: new Date(Date.now() - 2700000).toISOString(),
      endTs: new Date(Date.now() - 900000).toISOString()
    },
    hash: 'c3d4e5f6789012345678901234567890abcdef12',
    size: 512,
    validator: 'validator-01'
  }
];

const fetchProofs = async (query?: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) {
    return { proofs: mockProofs };
  }
  
  // Simple filtering based on query
  const filteredProofs = mockProofs.filter(proof => 
    proof.metadata.propertyId.toLowerCase().includes(query.toLowerCase()) ||
    proof.type.toLowerCase().includes(query.toLowerCase()) ||
    proof.status.toLowerCase().includes(query.toLowerCase())
  );
  
  return { proofs: filteredProofs };
};

export const useProofs = (query?: string) => {
  return useQuery({
    queryKey: ['proofs', query],
    queryFn: () => fetchProofs(query),
    refetchInterval: 15000, // Auto-refresh every 15 seconds
    staleTime: 10000
  });
};
