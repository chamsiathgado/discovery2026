// Données mockées réalistes pour le Bénin

export type BorneStatus = 'active' | 'maintenance' | 'hors-service' | 'forte-affluence';

export interface Borne {
  id: string;
  name: string;
  status: BorneStatus;
  power: number; // kW
  batteryLevel?: number; // % pour bornes solaires
  currentCharge: number; // % utilisation
  lastMaintenance: string;
  type: 'standard' | 'rapide' | 'solaire';
}

export interface Station {
  id: string;
  name: string;
  city: string;
  position: [number, number]; // [lat, lng]
  bornes: Borne[];
  occupancy: number; // %
  status: 'operational' | 'degraded' | 'critical';
}

export const BENIN_CITIES = {
  cotonou: { lat: 6.3654, lng: 2.4183 },
  portoNovo: { lat: 6.4969, lng: 2.6289 },
  parakou: { lat: 9.3372, lng: 2.6303 },
};

export const mockStations: Station[] = [
  // Cotonou - 5 stations
  {
    id: 'COT-001',
    name: 'Station Plateau Cotonou',
    city: 'Cotonou',
    position: [6.3684, 2.4283],
    occupancy: 75,
    status: 'operational',
    bornes: [
      {
        id: 'B-COT-001-1',
        name: 'Borne A1',
        status: 'active',
        power: 22,
        currentCharge: 80,
        lastMaintenance: '2026-01-10',
        type: 'rapide',
      },
      {
        id: 'B-COT-001-2',
        name: 'Borne A2',
        status: 'forte-affluence',
        power: 22,
        currentCharge: 95,
        lastMaintenance: '2026-01-12',
        type: 'rapide',
      },
      {
        id: 'B-COT-001-3',
        name: 'Borne A3',
        status: 'active',
        power: 11,
        currentCharge: 45,
        lastMaintenance: '2026-01-08',
        type: 'standard',
      },
    ],
  },
  {
    id: 'COT-002',
    name: 'Station Akpakpa',
    city: 'Cotonou',
    position: [6.3554, 2.4383],
    occupancy: 45,
    status: 'operational',
    bornes: [
      {
        id: 'B-COT-002-1',
        name: 'Borne B1',
        status: 'active',
        power: 50,
        batteryLevel: 85,
        currentCharge: 30,
        lastMaintenance: '2026-01-13',
        type: 'solaire',
      },
      {
        id: 'B-COT-002-2',
        name: 'Borne B2',
        status: 'maintenance',
        power: 22,
        currentCharge: 0,
        lastMaintenance: '2026-01-14',
        type: 'rapide',
      },
    ],
  },
  {
    id: 'COT-003',
    name: 'Station Étoile Rouge',
    city: 'Cotonou',
    position: [6.3754, 2.4083],
    occupancy: 90,
    status: 'critical',
    bornes: [
      {
        id: 'B-COT-003-1',
        name: 'Borne C1',
        status: 'forte-affluence',
        power: 22,
        currentCharge: 98,
        lastMaintenance: '2026-01-09',
        type: 'rapide',
      },
      {
        id: 'B-COT-003-2',
        name: 'Borne C2',
        status: 'forte-affluence',
        power: 22,
        currentCharge: 92,
        lastMaintenance: '2026-01-11',
        type: 'rapide',
      },
      {
        id: 'B-COT-003-3',
        name: 'Borne C3',
        status: 'hors-service',
        power: 11,
        currentCharge: 0,
        lastMaintenance: '2025-12-20',
        type: 'standard',
      },
    ],
  },
  {
    id: 'COT-004',
    name: 'Station Fidjrossè',
    city: 'Cotonou',
    position: [6.3484, 2.3883],
    occupancy: 60,
    status: 'operational',
    bornes: [
      {
        id: 'B-COT-004-1',
        name: 'Borne D1',
        status: 'active',
        power: 50,
        batteryLevel: 92,
        currentCharge: 55,
        lastMaintenance: '2026-01-12',
        type: 'solaire',
      },
      {
        id: 'B-COT-004-2',
        name: 'Borne D2',
        status: 'active',
        power: 22,
        currentCharge: 65,
        lastMaintenance: '2026-01-10',
        type: 'rapide',
      },
    ],
  },
  {
    id: 'COT-005',
    name: 'Station Cadjèhoun',
    city: 'Cotonou',
    position: [6.3584, 2.3983],
    occupancy: 35,
    status: 'operational',
    bornes: [
      {
        id: 'B-COT-005-1',
        name: 'Borne E1',
        status: 'active',
        power: 11,
        currentCharge: 25,
        lastMaintenance: '2026-01-13',
        type: 'standard',
      },
      {
        id: 'B-COT-005-2',
        name: 'Borne E2',
        status: 'active',
        power: 22,
        currentCharge: 40,
        lastMaintenance: '2026-01-11',
        type: 'rapide',
      },
    ],
  },

  // Porto-Novo - 3 stations
  {
    id: 'PN-001',
    name: 'Station Plateau Porto-Novo',
    city: 'Porto-Novo',
    position: [6.4969, 2.6289],
    occupancy: 55,
    status: 'operational',
    bornes: [
      {
        id: 'B-PN-001-1',
        name: 'Borne F1',
        status: 'active',
        power: 22,
        currentCharge: 50,
        lastMaintenance: '2026-01-12',
        type: 'rapide',
      },
      {
        id: 'B-PN-001-2',
        name: 'Borne F2',
        status: 'active',
        power: 50,
        batteryLevel: 78,
        currentCharge: 60,
        lastMaintenance: '2026-01-13',
        type: 'solaire',
      },
    ],
  },
  {
    id: 'PN-002',
    name: 'Station Ouando',
    city: 'Porto-Novo',
    position: [6.5069, 2.6189],
    occupancy: 25,
    status: 'operational',
    bornes: [
      {
        id: 'B-PN-002-1',
        name: 'Borne G1',
        status: 'active',
        power: 11,
        currentCharge: 20,
        lastMaintenance: '2026-01-14',
        type: 'standard',
      },
      {
        id: 'B-PN-002-2',
        name: 'Borne G2',
        status: 'active',
        power: 11,
        currentCharge: 30,
        lastMaintenance: '2026-01-10',
        type: 'standard',
      },
    ],
  },
  {
    id: 'PN-003',
    name: 'Station Avassa',
    city: 'Porto-Novo',
    position: [6.4869, 2.6389],
    occupancy: 70,
    status: 'degraded',
    bornes: [
      {
        id: 'B-PN-003-1',
        name: 'Borne H1',
        status: 'forte-affluence',
        power: 22,
        currentCharge: 85,
        lastMaintenance: '2026-01-09',
        type: 'rapide',
      },
      {
        id: 'B-PN-003-2',
        name: 'Borne H2',
        status: 'maintenance',
        power: 22,
        currentCharge: 0,
        lastMaintenance: '2026-01-15',
        type: 'rapide',
      },
    ],
  },

  // Parakou - 2 stations
  {
    id: 'PAR-001',
    name: 'Station Centre Parakou',
    city: 'Parakou',
    position: [9.3372, 2.6303],
    occupancy: 40,
    status: 'operational',
    bornes: [
      {
        id: 'B-PAR-001-1',
        name: 'Borne I1',
        status: 'active',
        power: 50,
        batteryLevel: 88,
        currentCharge: 35,
        lastMaintenance: '2026-01-11',
        type: 'solaire',
      },
      {
        id: 'B-PAR-001-2',
        name: 'Borne I2',
        status: 'active',
        power: 22,
        currentCharge: 45,
        lastMaintenance: '2026-01-12',
        type: 'rapide',
      },
    ],
  },
  {
    id: 'PAR-002',
    name: 'Station Banikanni',
    city: 'Parakou',
    position: [9.3272, 2.6403],
    occupancy: 50,
    status: 'operational',
    bornes: [
      {
        id: 'B-PAR-002-1',
        name: 'Borne J1',
        status: 'active',
        power: 11,
        currentCharge: 40,
        lastMaintenance: '2026-01-13',
        type: 'standard',
      },
      {
        id: 'B-PAR-002-2',
        name: 'Borne J2',
        status: 'active',
        power: 22,
        currentCharge: 60,
        lastMaintenance: '2026-01-10',
        type: 'rapide',
      },
    ],
  },
];

// Données pour graphiques et analyses
export const hourlyUsageData = [
  { hour: '00h', usage: 15 },
  { hour: '01h', usage: 10 },
  { hour: '02h', usage: 8 },
  { hour: '03h', usage: 7 },
  { hour: '04h', usage: 12 },
  { hour: '05h', usage: 25 },
  { hour: '06h', usage: 45 },
  { hour: '07h', usage: 70 },
  { hour: '08h', usage: 85 },
  { hour: '09h', usage: 92 },
  { hour: '10h', usage: 95 },
  { hour: '11h', usage: 88 },
  { hour: '12h', usage: 75 },
  { hour: '13h', usage: 65 },
  { hour: '14h', usage: 70 },
  { hour: '15h', usage: 80 },
  { hour: '16h', usage: 90 },
  { hour: '17h', usage: 95 },
  { hour: '18h', usage: 85 },
  { hour: '19h', usage: 70 },
  { hour: '20h', usage: 55 },
  { hour: '21h', usage: 40 },
  { hour: '22h', usage: 30 },
  { hour: '23h', usage: 20 },
];

export const cityUsageData = [
  { city: 'Cotonou', active: 12, maintenance: 2, 'hors-service': 1 },
  { city: 'Porto-Novo', active: 5, maintenance: 1, 'hors-service': 0 },
  { city: 'Parakou', active: 4, maintenance: 0, 'hors-service': 0 },
];

export interface AIRecommendation {
  id: string;
  type: 'warning' | 'suggestion' | 'critical';
  title: string;
  description: string;
  action: string;
  priority: number;
  timestamp: string;
}

export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'AI-001',
    type: 'critical',
    title: 'Saturation imminente - Station Étoile Rouge',
    description: 'Taux d\'occupation de 90% détecté avec tendance à la hausse. Période critique entre 09h et 12h.',
    action: 'Ajouter 2 bornes rapides supplémentaires',
    priority: 1,
    timestamp: '2026-01-15T09:30:00',
  },
  {
    id: 'AI-002',
    type: 'warning',
    title: 'Maintenance préventive requise',
    description: 'Borne C3 (Étoile Rouge) hors service depuis 25 jours. Risque d\'aggravation.',
    action: 'Planifier intervention technique urgente',
    priority: 2,
    timestamp: '2026-01-15T08:15:00',
  },
  {
    id: 'AI-003',
    type: 'suggestion',
    title: 'Optimisation réseau Cotonou',
    description: 'Redistribution de charge possible vers Station Cadjèhoun (35% occupancy) depuis Plateau (75%).',
    action: 'Inciter utilisateurs via application mobile',
    priority: 3,
    timestamp: '2026-01-15T07:45:00',
  },
  {
    id: 'AI-004',
    type: 'warning',
    title: 'Batterie solaire dégradée',
    description: 'Station Ouando PN-002 : efficacité énergétique en baisse de 15% sur 7 jours.',
    action: 'Vérifier panneaux solaires et contrôleur',
    priority: 2,
    timestamp: '2026-01-15T06:20:00',
  },
  {
    id: 'AI-005',
    type: 'suggestion',
    title: 'Expansion réseau Parakou',
    description: 'Taux d\'occupation moyen de 45% avec demande croissante. Zone sous-équipée.',
    action: 'Étudier implantation 2 nouvelles stations',
    priority: 4,
    timestamp: '2026-01-14T18:00:00',
  },
];
