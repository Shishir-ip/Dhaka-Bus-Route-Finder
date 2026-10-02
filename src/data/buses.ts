import { Bus } from '../types';

export const buses: Bus[] = [
  {
    id: 'bus-001',
    nameEn: 'Achim Paribahan',
    nameBn: 'অছিম পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-001a',
        busId: 'bus-001',
        direction: 'both',
        stops: [
          { locationId: 'loc-001', order: 1 },
          { locationId: 'loc-002', order: 2 },
          { locationId: 'loc-003', order: 3 },
          { locationId: 'loc-004', order: 4 },
          { locationId: 'loc-005', order: 5 },
          { locationId: 'loc-009', order: 6 },
          { locationId: 'loc-010', order: 7 },
          { locationId: 'loc-011', order: 8 },
          { locationId: 'loc-012', order: 9 },
          { locationId: 'loc-013', order: 10 },
          { locationId: 'loc-014', order: 11 },
          { locationId: 'loc-015', order: 12 },
          { locationId: 'loc-016', order: 13 },
          { locationId: 'loc-017', order: 14 },
          { locationId: 'loc-018', order: 15 },
          { locationId: 'loc-019', order: 16 },
          { locationId: 'loc-020', order: 17 },
          { locationId: 'loc-021', order: 18 },
          { locationId: 'loc-022', order: 19 },
          { locationId: 'loc-023', order: 20 },
          { locationId: 'loc-024', order: 21 },
          { locationId: 'loc-025', order: 22 },
          { locationId: 'loc-026', order: 23 },
          { locationId: 'loc-027', order: 24 },
          { locationId: 'loc-029', order: 25 },
        ]
      }
    ]
  },
  {
    id: 'bus-002',
    nameEn: 'BRTC AC Bus',
    nameBn: 'বিআরটিসি এসি বাস',
    type: 'AC',
    operatingHours: '7:00 AM - 11:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-002a',
        busId: 'bus-002',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-012', order: 2 },
          { locationId: 'loc-013', order: 3 },
          { locationId: 'loc-014', order: 4 },
          { locationId: 'loc-031', order: 5 },
          { locationId: 'loc-032', order: 6 },
          { locationId: 'loc-030', order: 7 },
          { locationId: 'loc-019', order: 8 },
          { locationId: 'loc-020', order: 9 },
          { locationId: 'loc-021', order: 10 },
          { locationId: 'loc-022', order: 11 },
          { locationId: 'loc-023', order: 12 },
          { locationId: 'loc-024', order: 13 },
          { locationId: 'loc-025', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-003',
    nameEn: 'Shadhin Paribahan',
    nameBn: 'স্বাধীন পরিবহন',
    type: 'Local',
    operatingHours: '6:30 AM - 9:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-003a',
        busId: 'bus-003',
        direction: 'both',
        stops: [
          { locationId: 'loc-049', order: 1 },
          { locationId: 'loc-050', order: 2 },
          { locationId: 'loc-038', order: 3 },
          { locationId: 'loc-037', order: 4 },
          { locationId: 'loc-036', order: 5 },
          { locationId: 'loc-035', order: 6 },
          { locationId: 'loc-034', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-076', order: 9 },
          { locationId: 'loc-078', order: 10 },
          { locationId: 'loc-025', order: 11 },
          { locationId: 'loc-026', order: 12 },
          { locationId: 'loc-027', order: 13 },
          { locationId: 'loc-053', order: 14 },
          { locationId: 'loc-054', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-004',
    nameEn: 'Bikalpa Paribahan',
    nameBn: 'বিকল্প পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 10:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-004a',
        busId: 'bus-004',
        direction: 'both',
        stops: [
          { locationId: 'loc-065', order: 1 },
          { locationId: 'loc-064', order: 2 },
          { locationId: 'loc-063', order: 3 },
          { locationId: 'loc-001', order: 4 },
          { locationId: 'loc-002', order: 5 },
          { locationId: 'loc-003', order: 6 },
          { locationId: 'loc-004', order: 7 },
          { locationId: 'loc-041', order: 8 },
          { locationId: 'loc-042', order: 9 },
          { locationId: 'loc-043', order: 10 },
          { locationId: 'loc-021', order: 11 },
          { locationId: 'loc-022', order: 12 },
          { locationId: 'loc-023', order: 13 },
          { locationId: 'loc-024', order: 14 },
          { locationId: 'loc-025', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-005',
    nameEn: 'Chalapika Paribahan',
    nameBn: 'চলন্তিকা পরিবহন',
    type: 'Local',
    operatingHours: '6:30 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-005a',
        busId: 'bus-005',
        direction: 'both',
        stops: [
          { locationId: 'loc-005', order: 1 },
          { locationId: 'loc-006', order: 2 },
          { locationId: 'loc-007', order: 3 },
          { locationId: 'loc-008', order: 4 },
          { locationId: 'loc-059', order: 5 },
          { locationId: 'loc-058', order: 6 },
          { locationId: 'loc-010', order: 7 },
          { locationId: 'loc-011', order: 8 },
          { locationId: 'loc-012', order: 9 },
          { locationId: 'loc-013', order: 10 },
          { locationId: 'loc-014', order: 11 },
          { locationId: 'loc-031', order: 12 },
          { locationId: 'loc-030', order: 13 },
          { locationId: 'loc-019', order: 14 },
          { locationId: 'loc-021', order: 15 },
          { locationId: 'loc-022', order: 16 },
          { locationId: 'loc-023', order: 17 },
          { locationId: 'loc-024', order: 18 },
          { locationId: 'loc-025', order: 19 },
          { locationId: 'loc-026', order: 20 },
        ]
      }
    ]
  },
  {
    id: 'bus-006',
    nameEn: 'Rupantara Paribahan',
    nameBn: 'রূপান্তর পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-006a',
        busId: 'bus-006',
        direction: 'both',
        stops: [
          { locationId: 'loc-049', order: 1 },
          { locationId: 'loc-050', order: 2 },
          { locationId: 'loc-038', order: 3 },
          { locationId: 'loc-039', order: 4 },
          { locationId: 'loc-035', order: 5 },
          { locationId: 'loc-034', order: 6 },
          { locationId: 'loc-023', order: 7 },
          { locationId: 'loc-075', order: 8 },
          { locationId: 'loc-074', order: 9 },
          { locationId: 'loc-073', order: 10 },
          { locationId: 'loc-072', order: 11 },
          { locationId: 'loc-071', order: 12 },
          { locationId: 'loc-070', order: 13 },
          { locationId: 'loc-046', order: 14 },
          { locationId: 'loc-045', order: 15 },
          { locationId: 'loc-016', order: 16 },
        ]
      }
    ]
  },
  {
    id: 'bus-007',
    nameEn: 'Prochesta Paribahan',
    nameBn: 'প্রচেষ্টা পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 11:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-007a',
        busId: 'bus-007',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-090', order: 2 },
          { locationId: 'loc-091', order: 3 },
          { locationId: 'loc-092', order: 4 },
          { locationId: 'loc-093', order: 5 },
          { locationId: 'loc-012', order: 6 },
          { locationId: 'loc-011', order: 7 },
          { locationId: 'loc-010', order: 8 },
          { locationId: 'loc-009', order: 9 },
          { locationId: 'loc-005', order: 10 },
          { locationId: 'loc-004', order: 11 },
          { locationId: 'loc-041', order: 12 },
          { locationId: 'loc-042', order: 13 },
          { locationId: 'loc-043', order: 14 },
          { locationId: 'loc-021', order: 15 },
          { locationId: 'loc-051', order: 16 },
          { locationId: 'loc-022', order: 17 },
          { locationId: 'loc-023', order: 18 },
          { locationId: 'loc-024', order: 19 },
          { locationId: 'loc-025', order: 20 },
        ]
      }
    ]
  },
  {
    id: 'bus-008',
    nameEn: 'Sundarban Paribahan',
    nameBn: 'সুন্দরবন পরিবহন',
    type: 'Local',
    operatingHours: '6:30 AM - 10:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-008a',
        busId: 'bus-008',
        direction: 'both',
        stops: [
          { locationId: 'loc-068', order: 1 },
          { locationId: 'loc-067', order: 2 },
          { locationId: 'loc-066', order: 3 },
          { locationId: 'loc-033', order: 4 },
          { locationId: 'loc-012', order: 5 },
          { locationId: 'loc-013', order: 6 },
          { locationId: 'loc-014', order: 7 },
          { locationId: 'loc-031', order: 8 },
          { locationId: 'loc-030', order: 9 },
          { locationId: 'loc-019', order: 10 },
          { locationId: 'loc-020', order: 11 },
          { locationId: 'loc-021', order: 12 },
          { locationId: 'loc-022', order: 13 },
          { locationId: 'loc-023', order: 14 },
          { locationId: 'loc-078', order: 15 },
          { locationId: 'loc-025', order: 16 },
          { locationId: 'loc-026', order: 17 },
          { locationId: 'loc-027', order: 18 },
          { locationId: 'loc-069', order: 19 },
        ]
      }
    ]
  },
  {
    id: 'bus-009',
    nameEn: 'Dhaka Metro Rail Shuttle',
    nameBn: 'ঢাকা মেট্রো রেল শাটল',
    type: 'Shuttle',
    operatingHours: '8:00 AM - 8:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-009a',
        busId: 'bus-009',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-012', order: 2 },
          { locationId: 'loc-013', order: 3 },
          { locationId: 'loc-014', order: 4 },
          { locationId: 'loc-095', order: 5 },
          { locationId: 'loc-019', order: 6 },
          { locationId: 'loc-020', order: 7 },
          { locationId: 'loc-021', order: 8 },
          { locationId: 'loc-022', order: 9 },
          { locationId: 'loc-023', order: 10 },
          { locationId: 'loc-078', order: 11 },
          { locationId: 'loc-025', order: 12 },
          { locationId: 'loc-072', order: 13 },
        ]
      }
    ]
  },
  {
    id: 'bus-010',
    nameEn: 'Kamalpur Express',
    nameBn: 'কমলাপুর এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-010a',
        busId: 'bus-010',
        direction: 'both',
        stops: [
          { locationId: 'loc-005', order: 1 },
          { locationId: 'loc-041', order: 2 },
          { locationId: 'loc-042', order: 3 },
          { locationId: 'loc-043', order: 4 },
          { locationId: 'loc-021', order: 5 },
          { locationId: 'loc-051', order: 6 },
          { locationId: 'loc-048', order: 7 },
          { locationId: 'loc-047', order: 8 },
          { locationId: 'loc-099', order: 9 },
          { locationId: 'loc-046', order: 10 },
          { locationId: 'loc-087', order: 11 },
          { locationId: 'loc-088', order: 12 },
          { locationId: 'loc-074', order: 13 },
          { locationId: 'loc-073', order: 14 },
          { locationId: 'loc-072', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-011',
    nameEn: 'Nobodoy Paribahan',
    nameBn: 'নবদয় পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 9:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-011a',
        busId: 'bus-011',
        direction: 'both',
        stops: [
          { locationId: 'loc-049', order: 1 },
          { locationId: 'loc-057', order: 2 },
          { locationId: 'loc-050', order: 3 },
          { locationId: 'loc-038', order: 4 },
          { locationId: 'loc-039', order: 5 },
          { locationId: 'loc-035', order: 6 },
          { locationId: 'loc-034', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-076', order: 9 },
          { locationId: 'loc-077', order: 10 },
          { locationId: 'loc-078', order: 11 },
          { locationId: 'loc-025', order: 12 },
          { locationId: 'loc-080', order: 13 },
          { locationId: 'loc-081', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-012',
    nameEn: 'Surjya Paribahan',
    nameBn: 'সূর্য পরিবহন',
    type: 'Local',
    operatingHours: '6:30 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-012a',
        busId: 'bus-012',
        direction: 'both',
        stops: [
          { locationId: 'loc-001', order: 1 },
          { locationId: 'loc-002', order: 2 },
          { locationId: 'loc-003', order: 3 },
          { locationId: 'loc-004', order: 4 },
          { locationId: 'loc-005', order: 5 },
          { locationId: 'loc-006', order: 6 },
          { locationId: 'loc-007', order: 7 },
          { locationId: 'loc-008', order: 8 },
          { locationId: 'loc-059', order: 9 },
          { locationId: 'loc-058', order: 10 },
          { locationId: 'loc-060', order: 11 },
          { locationId: 'loc-061', order: 12 },
          { locationId: 'loc-062', order: 13 },
          { locationId: 'loc-012', order: 14 },
          { locationId: 'loc-013', order: 15 },
          { locationId: 'loc-014', order: 16 },
          { locationId: 'loc-015', order: 17 },
          { locationId: 'loc-016', order: 18 },
          { locationId: 'loc-045', order: 19 },
          { locationId: 'loc-046', order: 20 },
          { locationId: 'loc-070', order: 21 },
          { locationId: 'loc-071', order: 22 },
          { locationId: 'loc-072', order: 23 },
        ]
      }
    ]
  },
  {
    id: 'bus-013',
    nameEn: 'Dhaka City Transport',
    nameBn: 'ঢাকা সিটি ট্রান্সপোর্ট',
    type: 'Local',
    operatingHours: '6:00 AM - 11:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-013a',
        busId: 'bus-013',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-012', order: 2 },
          { locationId: 'loc-011', order: 3 },
          { locationId: 'loc-010', order: 4 },
          { locationId: 'loc-009', order: 5 },
          { locationId: 'loc-005', order: 6 },
          { locationId: 'loc-004', order: 7 },
          { locationId: 'loc-003', order: 8 },
          { locationId: 'loc-041', order: 9 },
          { locationId: 'loc-042', order: 10 },
          { locationId: 'loc-043', order: 11 },
          { locationId: 'loc-021', order: 12 },
          { locationId: 'loc-022', order: 13 },
          { locationId: 'loc-023', order: 14 },
          { locationId: 'loc-075', order: 15 },
          { locationId: 'loc-074', order: 16 },
          { locationId: 'loc-078', order: 17 },
          { locationId: 'loc-025', order: 18 },
          { locationId: 'loc-026', order: 19 },
          { locationId: 'loc-027', order: 20 },
        ]
      }
    ]
  },
  {
    id: 'bus-014',
    nameEn: 'Mirpur Express',
    nameBn: 'মিরপুর এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-014a',
        busId: 'bus-014',
        direction: 'both',
        stops: [
          { locationId: 'loc-005', order: 1 },
          { locationId: 'loc-004', order: 2 },
          { locationId: 'loc-003', order: 3 },
          { locationId: 'loc-002', order: 4 },
          { locationId: 'loc-001', order: 5 },
          { locationId: 'loc-063', order: 6 },
          { locationId: 'loc-064', order: 7 },
          { locationId: 'loc-065', order: 8 },
        ]
      }
    ]
  },
  {
    id: 'bus-015',
    nameEn: 'Uttara Link',
    nameBn: 'উত্তরা লিংক',
    type: 'Local',
    operatingHours: '7:00 AM - 9:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-015a',
        busId: 'bus-015',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-090', order: 2 },
          { locationId: 'loc-091', order: 3 },
          { locationId: 'loc-093', order: 4 },
          { locationId: 'loc-012', order: 5 },
          { locationId: 'loc-011', order: 6 },
          { locationId: 'loc-010', order: 7 },
          { locationId: 'loc-009', order: 8 },
          { locationId: 'loc-005', order: 9 },
          { locationId: 'loc-004', order: 10 },
          { locationId: 'loc-041', order: 11 },
          { locationId: 'loc-042', order: 12 },
          { locationId: 'loc-043', order: 13 },
          { locationId: 'loc-021', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-016',
    nameEn: 'Gulshan Shuttle',
    nameBn: 'গুলশান শাটল',
    type: 'Local',
    operatingHours: '7:00 AM - 9:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-016a',
        busId: 'bus-016',
        direction: 'both',
        stops: [
          { locationId: 'loc-021', order: 1 },
          { locationId: 'loc-019', order: 2 },
          { locationId: 'loc-030', order: 3 },
          { locationId: 'loc-031', order: 4 },
          { locationId: 'loc-032', order: 5 },
          { locationId: 'loc-014', order: 6 },
          { locationId: 'loc-015', order: 7 },
          { locationId: 'loc-016', order: 8 },
          { locationId: 'loc-017', order: 9 },
          { locationId: 'loc-018', order: 10 },
          { locationId: 'loc-045', order: 11 },
          { locationId: 'loc-046', order: 12 },
          { locationId: 'loc-072', order: 13 },
        ]
      }
    ]
  },
  {
    id: 'bus-017',
    nameEn: 'Mohakhali Express',
    nameBn: 'মোহাখালী এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:30 AM - 10:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-017a',
        busId: 'bus-017',
        direction: 'both',
        stops: [
          { locationId: 'loc-012', order: 1 },
          { locationId: 'loc-013', order: 2 },
          { locationId: 'loc-095', order: 3 },
          { locationId: 'loc-019', order: 4 },
          { locationId: 'loc-020', order: 5 },
          { locationId: 'loc-021', order: 6 },
          { locationId: 'loc-051', order: 7 },
          { locationId: 'loc-022', order: 8 },
          { locationId: 'loc-023', order: 9 },
          { locationId: 'loc-075', order: 10 },
          { locationId: 'loc-074', order: 11 },
          { locationId: 'loc-073', order: 12 },
          { locationId: 'loc-025', order: 13 },
          { locationId: 'loc-026', order: 14 },
          { locationId: 'loc-027', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-018',
    nameEn: 'Dhanmondi Link',
    nameBn: 'ধানমন্ডি লিংক',
    type: 'Local',
    operatingHours: '6:30 AM - 9:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-018a',
        busId: 'bus-018',
        direction: 'both',
        stops: [
          { locationId: 'loc-035', order: 1 },
          { locationId: 'loc-036', order: 2 },
          { locationId: 'loc-037', order: 3 },
          { locationId: 'loc-038', order: 4 },
          { locationId: 'loc-050', order: 5 },
          { locationId: 'loc-049', order: 6 },
          { locationId: 'loc-040', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-076', order: 9 },
          { locationId: 'loc-078', order: 10 },
          { locationId: 'loc-025', order: 11 },
          { locationId: 'loc-080', order: 12 },
          { locationId: 'loc-0100', order: 13 },
          { locationId: 'loc-081', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-019',
    nameEn: 'Badda Connector',
    nameBn: 'বাড্ডা কানেক্টর',
    type: 'Local',
    operatingHours: '6:30 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-019a',
        busId: 'bus-019',
        direction: 'both',
        stops: [
          { locationId: 'loc-016', order: 1 },
          { locationId: 'loc-017', order: 2 },
          { locationId: 'loc-018', order: 3 },
          { locationId: 'loc-089', order: 4 },
          { locationId: 'loc-085', order: 5 },
          { locationId: 'loc-014', order: 6 },
          { locationId: 'loc-031', order: 7 },
          { locationId: 'loc-030', order: 8 },
          { locationId: 'loc-019', order: 9 },
          { locationId: 'loc-020', order: 10 },
          { locationId: 'loc-021', order: 11 },
          { locationId: 'loc-022', order: 12 },
          { locationId: 'loc-023', order: 13 },
          { locationId: 'loc-024', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-020',
    nameEn: 'Jatrabari Express',
    nameBn: 'যাত্রাবাড়ী এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-020a',
        busId: 'bus-020',
        direction: 'both',
        stops: [
          { locationId: 'loc-021', order: 1 },
          { locationId: 'loc-022', order: 2 },
          { locationId: 'loc-023', order: 3 },
          { locationId: 'loc-078', order: 4 },
          { locationId: 'loc-025', order: 5 },
          { locationId: 'loc-026', order: 6 },
          { locationId: 'loc-027', order: 7 },
          { locationId: 'loc-053', order: 8 },
          { locationId: 'loc-056', order: 9 },
          { locationId: 'loc-055', order: 10 },
          { locationId: 'loc-054', order: 11 },
        ]
      }
    ]
  },
  {
    id: 'bus-021',
    nameEn: 'Pragati Paribahan',
    nameBn: 'প্রগতি পরিবহন',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-021a',
        busId: 'bus-021',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-091', order: 2 },
          { locationId: 'loc-093', order: 3 },
          { locationId: 'loc-012', order: 4 },
          { locationId: 'loc-013', order: 5 },
          { locationId: 'loc-014', order: 6 },
          { locationId: 'loc-031', order: 7 },
          { locationId: 'loc-032', order: 8 },
          { locationId: 'loc-030', order: 9 },
          { locationId: 'loc-019', order: 10 },
          { locationId: 'loc-020', order: 11 },
          { locationId: 'loc-021', order: 12 },
          { locationId: 'loc-051', order: 13 },
          { locationId: 'loc-022', order: 14 },
          { locationId: 'loc-023', order: 15 },
          { locationId: 'loc-075', order: 16 },
          { locationId: 'loc-074', order: 17 },
          { locationId: 'loc-073', order: 18 },
          { locationId: 'loc-025', order: 19 },
          { locationId: 'loc-026', order: 20 },
        ]
      }
    ]
  },
  {
    id: 'bus-022',
    nameEn: 'Lakkhi Paribahan',
    nameBn: 'লক্ষী পরিবহন',
    type: 'Local',
    operatingHours: '6:30 AM - 10:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-022a',
        busId: 'bus-022',
        direction: 'both',
        stops: [
          { locationId: 'loc-049', order: 1 },
          { locationId: 'loc-057', order: 2 },
          { locationId: 'loc-050', order: 3 },
          { locationId: 'loc-038', order: 4 },
          { locationId: 'loc-039', order: 5 },
          { locationId: 'loc-035', order: 6 },
          { locationId: 'loc-034', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-076', order: 9 },
          { locationId: 'loc-077', order: 10 },
          { locationId: 'loc-078', order: 11 },
          { locationId: 'loc-025', order: 12 },
          { locationId: 'loc-080', order: 13 },
          { locationId: 'loc-0100', order: 14 },
          { locationId: 'loc-081', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-023',
    nameEn: 'Dhaka Express',
    nameBn: 'ঢাকা এক্সপ্রেস',
    type: 'Express',
    operatingHours: '7:00 AM - 9:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-023a',
        busId: 'bus-023',
        direction: 'both',
        stops: [
          { locationId: 'loc-068', order: 1 },
          { locationId: 'loc-067', order: 2 },
          { locationId: 'loc-066', order: 3 },
          { locationId: 'loc-033', order: 4 },
          { locationId: 'loc-012', order: 5 },
          { locationId: 'loc-019', order: 6 },
          { locationId: 'loc-021', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-025', order: 9 },
          { locationId: 'loc-027', order: 10 },
          { locationId: 'loc-069', order: 11 },
        ]
      }
    ]
  },
  {
    id: 'bus-024',
    nameEn: 'Mirpur Badda Link',
    nameBn: 'মিরপুর বাড্ডা লিংক',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-024a',
        busId: 'bus-024',
        direction: 'both',
        stops: [
          { locationId: 'loc-005', order: 1 },
          { locationId: 'loc-004', order: 2 },
          { locationId: 'loc-041', order: 3 },
          { locationId: 'loc-042', order: 4 },
          { locationId: 'loc-043', order: 5 },
          { locationId: 'loc-021', order: 6 },
          { locationId: 'loc-019', order: 7 },
          { locationId: 'loc-030', order: 8 },
          { locationId: 'loc-031', order: 9 },
          { locationId: 'loc-014', order: 10 },
          { locationId: 'loc-016', order: 11 },
          { locationId: 'loc-017', order: 12 },
          { locationId: 'loc-018', order: 13 },
          { locationId: 'loc-045', order: 14 },
          { locationId: 'loc-046', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-025',
    nameEn: 'Savar Counter',
    nameBn: 'সাভার কাউন্টার',
    type: 'Local',
    operatingHours: '6:00 AM - 9:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-025a',
        busId: 'bus-025',
        direction: 'both',
        stops: [
          { locationId: 'loc-065', order: 1 },
          { locationId: 'loc-064', order: 2 },
          { locationId: 'loc-063', order: 3 },
          { locationId: 'loc-001', order: 4 },
          { locationId: 'loc-002', order: 5 },
          { locationId: 'loc-003', order: 6 },
          { locationId: 'loc-004', order: 7 },
          { locationId: 'loc-005', order: 8 },
          { locationId: 'loc-009', order: 9 },
          { locationId: 'loc-010', order: 10 },
          { locationId: 'loc-011', order: 11 },
          { locationId: 'loc-012', order: 12 },
        ]
      }
    ]
  },
  {
    id: 'bus-026',
    nameEn: 'Nobodoy Express',
    nameBn: 'নবদয় এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:30 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-026a',
        busId: 'bus-026',
        direction: 'both',
        stops: [
          { locationId: 'loc-049', order: 1 },
          { locationId: 'loc-050', order: 2 },
          { locationId: 'loc-038', order: 3 },
          { locationId: 'loc-037', order: 4 },
          { locationId: 'loc-036', order: 5 },
          { locationId: 'loc-035', order: 6 },
          { locationId: 'loc-034', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-075', order: 9 },
          { locationId: 'loc-074', order: 10 },
          { locationId: 'loc-078', order: 11 },
          { locationId: 'loc-025', order: 12 },
          { locationId: 'loc-026', order: 13 },
          { locationId: 'loc-027', order: 14 },
          { locationId: 'loc-053', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-027',
    nameEn: 'Uttara Badda Connect',
    nameBn: 'উত্তরা বাড্ডা কানেক্ট',
    type: 'Local',
    operatingHours: '6:30 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-027a',
        busId: 'bus-027',
        direction: 'both',
        stops: [
          { locationId: 'loc-033', order: 1 },
          { locationId: 'loc-090', order: 2 },
          { locationId: 'loc-091', order: 3 },
          { locationId: 'loc-093', order: 4 },
          { locationId: 'loc-012', order: 5 },
          { locationId: 'loc-013', order: 6 },
          { locationId: 'loc-014', order: 7 },
          { locationId: 'loc-085', order: 8 },
          { locationId: 'loc-089', order: 9 },
          { locationId: 'loc-018', order: 10 },
          { locationId: 'loc-017', order: 11 },
          { locationId: 'loc-016', order: 12 },
          { locationId: 'loc-045', order: 13 },
          { locationId: 'loc-046', order: 14 },
          { locationId: 'loc-087', order: 15 },
          { locationId: 'loc-072', order: 16 },
        ]
      }
    ]
  },
  {
    id: 'bus-028',
    nameEn: 'Arambagh Express',
    nameBn: 'আরামবাগ এক্সপ্রেস',
    type: 'Local',
    operatingHours: '6:00 AM - 10:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-028a',
        busId: 'bus-028',
        direction: 'both',
        stops: [
          { locationId: 'loc-035', order: 1 },
          { locationId: 'loc-034', order: 2 },
          { locationId: 'loc-023', order: 3 },
          { locationId: 'loc-076', order: 4 },
          { locationId: 'loc-078', order: 5 },
          { locationId: 'loc-073', order: 6 },
          { locationId: 'loc-074', order: 7 },
          { locationId: 'loc-088', order: 8 },
          { locationId: 'loc-087', order: 9 },
          { locationId: 'loc-086', order: 10 },
          { locationId: 'loc-047', order: 11 },
          { locationId: 'loc-099', order: 12 },
          { locationId: 'loc-046', order: 13 },
          { locationId: 'loc-045', order: 14 },
          { locationId: 'loc-016', order: 15 },
        ]
      }
    ]
  },
  {
    id: 'bus-029',
    nameEn: 'Tongi Shuttle',
    nameBn: 'টঙ্গী শাটল',
    type: 'Shuttle',
    operatingHours: '7:00 AM - 9:00 PM',
    isActive: true,
    routes: [
      {
        id: 'route-029a',
        busId: 'bus-029',
        direction: 'both',
        stops: [
          { locationId: 'loc-067', order: 1 },
          { locationId: 'loc-066', order: 2 },
          { locationId: 'loc-033', order: 3 },
          { locationId: 'loc-012', order: 4 },
          { locationId: 'loc-011', order: 5 },
          { locationId: 'loc-010', order: 6 },
          { locationId: 'loc-009', order: 7 },
          { locationId: 'loc-005', order: 8 },
          { locationId: 'loc-004', order: 9 },
          { locationId: 'loc-003', order: 10 },
          { locationId: 'loc-041', order: 11 },
          { locationId: 'loc-042', order: 12 },
          { locationId: 'loc-043', order: 13 },
          { locationId: 'loc-021', order: 14 },
        ]
      }
    ]
  },
  {
    id: 'bus-030',
    nameEn: 'Dhanmondi Gulshan',
    nameBn: 'ধানমন্ডি গুলশান',
    type: 'Local',
    operatingHours: '7:00 AM - 9:30 PM',
    isActive: true,
    routes: [
      {
        id: 'route-030a',
        busId: 'bus-030',
        direction: 'both',
        stops: [
          { locationId: 'loc-035', order: 1 },
          { locationId: 'loc-036', order: 2 },
          { locationId: 'loc-037', order: 3 },
          { locationId: 'loc-038', order: 4 },
          { locationId: 'loc-050', order: 5 },
          { locationId: 'loc-049', order: 6 },
          { locationId: 'loc-040', order: 7 },
          { locationId: 'loc-023', order: 8 },
          { locationId: 'loc-019', order: 9 },
          { locationId: 'loc-030', order: 10 },
          { locationId: 'loc-031', order: 11 },
          { locationId: 'loc-032', order: 12 },
          { locationId: 'loc-014', order: 13 },
          { locationId: 'loc-016', order: 14 },
        ]
      }
    ]
  },
];
