import { Branch } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'td-pj',
    name: 'T.low Dental Clinic (Petaling Jaya)',
    address: '165-A, Jalan SS 2/24, SS 2',
    city: '47300 Petaling Jaya, Selangor',
    coords: { lat: 3.1167, lng: 101.6219 },
    phone: '+60 16-221 5926',
    hours: '9:00 AM - 8:00 PM',
    transport: 'LRT Taman Bahagia (5 min drive) / RapidKL Bus T790',
    specialties: ['General Dentistry', 'Scaling & Polishing', 'Tooth Extraction']
  },
  {
    id: 'is-bj',
    name: 'i-Sihat Dental Care (Bukit Jalil)',
    address: 'Bumi, No. 66, 1st Floor, Jalan Jalil 1, Lebuhraya Bukit Jalil',
    city: 'Bukit Jalil, 57000 Kuala Lumpur',
    coords: { lat: 3.0526, lng: 101.6715 },
    phone: '+60 12-680 1232',
    hours: '10:00 AM - 9:00 PM',
    transport: 'LRT Awan Besar (Walking distance) / LRT Sri Petaling',
    specialties: ['Orthodontics', 'Invisalign', 'Teeth Whitening']
  },
  {
    id: 'is-sentul',
    name: 'i-Sihat Dental Care (Sentul)',
    address: 'AG - 16, Sentul Point, Jln Sentul Pasar',
    city: 'Sentul, 51000 Kuala Lumpur',
    coords: { lat: 3.1972, lng: 101.6925 },
    phone: '+60 11-3324 0938',
    hours: '9:00 AM - 8:00 PM',
    transport: 'MRT Sentul West / KTM Sentul (Direct bus access)',
    specialties: ['Dental Implants', 'Root Canal Treatment', 'Crowns & Bridges']
  },
  {
    id: 'is-setapak',
    name: 'i-Sihat Dental Care (Setapak)',
    address: '3A-G, Block C, Platinum Walk, Jln Langkawi',
    city: 'Taman Danau Kota, 53300 Kuala Lumpur',
    coords: { lat: 3.2035, lng: 101.7170 },
    phone: '+60 3-4131 9882',
    hours: '10:00 AM - 9:00 PM',
    transport: 'LRT Wangsa Maju (Grab/Bus distance) / RapidKL 250',
    specialties: ['Pediatric Dentistry', 'Braces', 'Wisdom Tooth Surgery']
  },
  {
    id: 'is-pg',
    name: 'i-Sihat Dental Care (Pasir Gudang)',
    address: 'No. 40, Jalan Serangkai 18, Taman Bukit Dahlia',
    city: 'Pasir Gudang, 81700 Johor Bahru, Johor',
    coords: { lat: 1.4789, lng: 103.8967 },
    phone: '+60 7-252 2882',
    hours: '9:00 AM - 6:00 PM',
    transport: 'Pasir Gudang Bus Terminal (10 min drive)',
    specialties: ['Minor Oral Surgery', 'Gum Treatment', 'Dentures']
  }
];