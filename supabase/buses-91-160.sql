-- =====================================================
-- Dhaka Bus Finder — BUSES 91-160
-- Complete Routes for 70 Additional Buses
-- =====================================================
-- Run AFTER all-routes-complete.sql
-- =====================================================

-- =====================================================
-- STEP 1: ADD NEW LOCATIONS
-- =====================================================
INSERT INTO locations (name_en, name_bn, aliases) VALUES
('Khilgaon Flyover', 'খিলগাঁও ফ্লাইওভার', ARRAY['khilgaon flyover', 'khilgaon flyover']),
('Golapbag Chourasta', 'গোলাপবাগ চৌরাস্তা', ARRAY['golapbag chourasta', 'golapbagh chourasta']),
('Kazla', 'কাজলা', ARRAY['kazla']),
('Dayaganj', 'দয়াগঞ্জ', ARRAY['dayaganj', 'dayagonj']),
('Dhupkhola', 'ধূপখোলা', ARRAY['dhupkhola']),
('Tolarbag', 'টোলারবাগ', ARRAY['tolarbag']),
('Jurain', 'জুরাইন', ARRAY['jurain']),
('Manikganj', 'মানিকগঞ্জ', ARRAY['manikganj']),
('Paturia', 'পাটুরিয়া', ARRAY['paturia']),
('Joydebpur', 'জয়দেবপুর', ARRAY['joydebpur']),
('Sreepur', 'শ্রীপুর', ARRAY['sreepur']),
('Baromi', 'বারোমি', ARRAY['baromi']),
('Fakirapul', 'ফকিরাপুল', ARRAY['fakirapul']),
('Tikatuli', 'টিকাটুলি', ARRAY['tikatuli']),
('Gandaria', 'গেন্ডারিয়া', ARRAY['gandaria']),
('Rajendrapur', 'রাজেন্দ্রপুর', ARRAY['rajendrapur']),
('IDB', 'আইডিবি', ARRAY['idb']),
('South Banasree', 'দক্ষিণ বনশ্রী', ARRAY['south banasree']),
('Shimultola', 'সিমুলতলা', ARRAY['shimultola']),
('Palli Bidyut', 'পল্লী বিদ্যুৎ', ARRAY['palli bidyut']),
('Savar Cantonment', 'সাভার ক্যান্টনমেন্ট', ARRAY['savar cantonment']),
('Victoria Park', 'ভিক্টোরিয়া পার্ক', ARRAY['victoria park']),
('Sanarpar', 'সানারপাড়', ARRAY['sanarpar']),
('Shia Masjid', 'শিয়া মসজিদ', ARRAY['shia masjid']),
('Dholairpar', 'ধলাইড়পাড়', ARRAY['dholairpar']),
('Dhakeshwari', 'ঢাকেশ্বরী', ARRAY['dhakeshwari']),
('Kanchpur', 'কাঞ্চপুর', ARRAY['kanchpur']),
('Vulta', 'ভুলতা', ARRAY['vulta']),
('Dhour', 'ঢাউর', ARRAY['dhour']),
('Tarabo', 'তারাবো', ARRAY['tarabo']),
('Madanpur', 'মদনপুর', ARRAY['madanpur']),
('Narshinghapur', 'নরসিংহাপুর', ARRAY['narshinghapur']),
('Sura Bari', 'সুরা বাড়ী', ARRAY['sura Bari']),
('Kashimpur', 'কাশিমপুর', ARRAY['kashimpur']),
('Jarun', 'জারুন', ARRAY['jarun']),
('Jamgora', 'জামগড়া', ARRAY['jamgora']),
('Konabari', 'কোনাবাড়ী', ARRAY['konabari']),
('Maowa', 'মাওয়া', ARRAY['maowa']),
('Mazar Road', 'মাজার রোড', ARRAY['mazar road']),
('Beribadh Tin Rastar Moor', 'বেরিবাধ তিন রাস্তার মোড়', ARRAY['beribadh tin rastar moor']),
('Rayer Bazar', 'রের বাজার', ARRAY['rayer bazar']),
('Sikder Medical College', 'সিকদার মেডিকেল কলেজ', ARRAY['sikder medical college']),
('Nawabganj', 'নবাবগঞ্জ', ARRAY['nawabganj']),
('Showari Ghat', 'শোয়ারী ঘাট', ARRAY['showari ghat']),
('Mitford Ghat', 'মিটফোর্ড ঘাট', ARRAY['mitford ghat']),
('Dhammondi', 'ধানমন্ডি', ARRAY['dhammondi']),
('Arambagh Kingdom', 'আরামবাগ কিংডম', ARRAY['arambagh kingdom']);

-- =====================================================
-- STEP 2: ADD 70 BUSES (91-160)
-- =====================================================
INSERT INTO buses (name_en, name_bn, type, operating_hours) VALUES
('Labbayek Bus', 'লাব্বাইক বাস', 'Local', '6:00 AM - 10:00 PM'),
('Lal Sabuj AC Bus', 'লাল সবুজ এসি বাস', 'AC', '6:00 AM - 10:00 PM'),
('Lams Paribahan', 'লামস পরিবহন বাস', 'Local', '6:00 AM - 10:00 PM'),
('Malancha Bus', 'মালঞ্চ বাস', 'Local', '6:00 AM - 10:00 PM'),
('Manjil Express', 'মাঞ্জিল এক্সপ্রেস বাস', 'Local', '6:00 AM - 10:00 PM'),
('Meghla Transport', 'মেঘলা ট্রান্সপোর্ট বাস', 'Local', '6:00 AM - 10:00 PM'),
('Meshkat Bus', 'মেসকাত বাস', 'Local', '6:00 AM - 10:00 PM'),
('Midline Bus', 'মিডলাইন বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mirpur Metro Services', 'মিরপুর মেট্রো সার্ভিস বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mirpur Link', 'মিরপুর লিংক বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mirpur Mission', 'মিরপুর মিশন বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mirpur Transport Service', 'মিরপুর ট্রান্সপোর্ট সার্ভিস বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mirpur United Service', 'মিরপুর ইউনাইটেড সার্ভিস বাস', 'Local', '6:00 AM - 10:00 PM'),
('MM Lovely', 'এম এম লাভলী বাস', 'Local', '6:00 AM - 10:00 PM'),
('Modhumita Bus', 'মধুমিতা বাস', 'Local', '6:00 AM - 10:00 PM'),
('Mohona Bus', 'মোহনা বাস', 'Local', '6:00 AM - 10:00 PM'),
('Moitri Bus', 'মৈত্রী বাস', 'Local', '6:00 AM - 10:00 PM'),
('Moumita Bus', 'মৌমিতা বাস', 'Local', '6:00 AM - 10:00 PM'),
('MTCL-2 Bus', 'এমটিসিএল ২ বাস', 'Local', '6:00 AM - 10:00 PM'),
('Nur E Makka', 'নূর এ মক্কা বাস', 'Local', '6:00 AM - 10:00 PM'),
('Nabakali', 'নবকালি', 'Local', '6:00 AM - 10:00 PM'),
('New Vision', 'নিউ ভিশন', 'Local', '6:00 AM - 10:00 PM'),
('Nilachol', 'নিলাচল', 'Local', '6:00 AM - 10:00 PM'),
('Nishorgo', 'নিসর্গ', 'Local', '6:00 AM - 10:00 PM'),
('Omama International', 'ওমামা ইন্টারন্যাশনাল বাস', 'Local', '6:00 AM - 10:00 PM'),
('One Transport', 'ওয়ান ট্রান্সপোর্ট', 'Local', '6:00 AM - 10:00 PM'),
('Pallabi Local Service', 'পল্লবী লোকাল সার্ভিস', 'Local', '6:00 AM - 10:00 PM'),
('Paristhan', 'পরিস্থান', 'Local', '6:00 AM - 10:00 PM'),
('Pallabi Super', 'পল্লবী সুপার বাস', 'Local', '6:00 AM - 10:00 PM'),
('Power Paribahan', 'পাওয়ার পরিবহন বাস', 'Local', '6:00 AM - 10:00 PM'),
('Prattay', 'প্রত্যয় বাস', 'Local', '6:00 AM - 10:00 PM'),
('Prochesta', 'প্রচেষ্টা বাস', 'Local', '6:00 AM - 10:00 PM'),
('Projapati', 'প্রজাপতি বাস', 'Local', '6:00 AM - 10:00 PM'),
('Provati Banasree', 'প্রভাতী বনশ্রী বাস', 'Local', '6:00 AM - 10:00 PM'),
('Purbachol Logistics', 'পূর্বাচল লজিস্টিকস বাস', 'Local', '6:00 AM - 10:00 PM'),
('Raida', 'রাইদা', 'Local', '6:00 AM - 10:00 PM'),
('Raja City', 'রাজা সিটি', 'Local', '6:00 AM - 10:00 PM'),
('Rajanigandha', 'রজনীগন্ধা', 'Local', '6:00 AM - 10:00 PM'),
('Rajdhani Super', 'রাজধানী', 'Local', '6:00 AM - 10:00 PM'),
('Ramjan', 'রমজান', 'Local', '6:00 AM - 10:00 PM'),
('Robrob', 'রবরব', 'Local', '6:00 AM - 10:00 PM'),
('Rois', 'রাইস', 'Local', '6:00 AM - 10:00 PM'),
('Rongdhonu Express', 'রংধনু এক্সপ্রেস', 'Local', '6:00 AM - 10:00 PM'),
('Runway Express', 'রানওয়ে এক্সপ্রেস', 'Local', '6:00 AM - 10:00 PM'),
('Rupa Paribahan', 'রুপা পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('Rupkotha', 'রুপকথা', 'Local', '6:00 AM - 10:00 PM'),
('Safety Druti', 'সেফটি দ্রুতি', 'Local', '6:00 AM - 10:00 PM'),
('Sakalpa Transport', 'স্বকল্প ট্রান্সপোর্ট', 'Local', '6:00 AM - 10:00 PM'),
('Salsabil', 'ছালছাবিল', 'Local', '6:00 AM - 10:00 PM'),
('Savar Paribahan', 'সাভার পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('Shadhin', 'স্বাধীন', 'Local', '6:00 AM - 10:00 PM'),
('Shadhin Express', 'স্বাধীন এক্সপ্রেস', 'Local', '6:00 AM - 10:00 PM'),
('Shahria Enterprise', 'শাহরিয়া এন্টারপ্রাইজ', 'Local', '6:00 AM - 10:00 PM'),
('Shatabdi', 'শতাব্দি', 'Local', '6:00 AM - 10:00 PM'),
('Shikhor Paribahan 1', 'শিখর পরিবহন ১', 'Local', '6:00 AM - 10:00 PM'),
('Shikhor Paribahan 2', 'শিখর পরিবহন ২', 'Local', '6:00 AM - 10:00 PM'),
('Suveccha', 'শুভেচ্ছা', 'Local', '6:00 AM - 10:00 PM'),
('Suvojatri', 'শুভযাত্রী', 'Local', '6:00 AM - 10:00 PM'),
('Siam Transport', 'সিয়াম ট্রান্সপোর্ট', 'Local', '6:00 AM - 10:00 PM'),
('Skyline', 'স্কাই লাইন', 'Local', '6:00 AM - 10:00 PM'),
('Somota Paribahan', 'সমতা পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('Somoy', 'সময়', 'Local', '6:00 AM - 10:00 PM'),
('Somoy Niyantran', 'সময় নিয়ন্ত্রণ', 'Local', '6:00 AM - 10:00 PM'),
('Super', 'সুপার', 'Local', '6:00 AM - 10:00 PM'),
('Supravat', 'সুপ্রভাত', 'Local', '6:00 AM - 10:00 PM'),
('Swajan Paribahan', 'স্বজন পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('Talukdar', 'তালুকদার', 'Local', '6:00 AM - 10:00 PM'),
('Tanjil Paribahan', 'তানজিল পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('Taranga Plus', 'তরঙ্গ প্লাস', 'Local', '6:00 AM - 10:00 PM'),
('Tetulia', 'তেতুলিয়া', 'Local', '6:00 AM - 10:00 PM');

-- =====================================================
-- STEP 3: ROUTES AND STOPS FOR ALL 70 BUSES
-- =====================================================

-- Bus 91: Labbayek Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Labbayek Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Labbayek Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Savar',1),('Hemayetpur',2),('Amin Bazar',3),('Gabtoli',4),('Technical',5),('Kallyanpur',6),('Shyamoli',7),('Shishu Mela',8),('College Gate',9),('Asad Gate',10),('Khamar Bari',11),('Farmgate',12),('Kawran Bazar',13),('Bangla Motor',14),('Mogbazar',15),('Mouchak',16),('Malibagh Moor',17),('Rajarbag',18),('Khilgaon Flyover',19),('Bashabo',20),('Mugdapara',21),('Manik Nagar',22),('Golapbag Chourasta',23),('Sayedabad',24),('Janapath Moor',25),('Jatrabari',26),('Kazla',27),('Shonir Akhra',28),('Rayerbag',29),('Matuail',30),('Sign Board',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 92: Lal Sabuj AC Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Lal Sabuj AC Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Lal Sabuj AC Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Nandan Park',1),('Zirani Bazar',2),('Baipayl',3),('Nobinagar',4),('Savar',5),('Hemayetpur',6),('Amin Bazar',7),('Gabtoli',8),('Technical',9),('Kallyanpur',10),('Shyamoli',11),('Shishu Mela',12),('College Gate',13),('Asad Gate',14),('Khamar Bari',15),('Farmgate',16),('Kawran Bazar',17),('Bangla Motor',18),('Shahbag',19),('High Court',20),('Press Club',21),('Paltan',22),('GPO',23),('Gulistan',24),('Motijheel',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 93: Lams Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Lams Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Lams Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 1',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Bijoy Sarani',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('Dainik Bangla Moor',19),('Motijheel',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 94: Malancha Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Malancha Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Malancha Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Star Kabab',3),('Dhanmondi 15',4),('Jigatola',5),('City College',6),('Science Lab',7),('Bata Signal',8),('Shahbag',9),('Matsya Bhaban',10),('High Court',11),('Press Club',12),('Paltan',13),('GPO',14),('Gulistan',15),('Dayaganj',16),('Dhupkhola',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 95: Manjil Express
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Manjil Express'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Manjil Express') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('GPO',9),('Paltan',10),('Kakrail',11),('Malibagh Moor',12),('Mouchak',13),('Mogbazar',14),('Satrasta',15),('Nabisco',16),('Mohakhali',17),('Chairman Bari',18),('Banani',19),('Kakali',20),('Staff Road',21),('MES',22),('Shewra',23),('Kuril Bishwa Road',24),('Khilkhet',25),('Airport',26),('Jashimuddin',27),('Rajlakshmi',28),('Azampur',29),('House Building',30),('Abdullahpur',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 96: Meghla Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Meghla Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Meghla Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Kalabagan',1),('Science Lab',2),('Katabon',3),('Bata Signal',4),('Shahbag',5),('Matsya Bhaban',6),('High Court',7),('Press Club',8),('Paltan',9),('GPO',10),('Gulistan',11),('Sayedabad',12),('Jatrabari',13),('Shonir Akhra',14),('Sign Board',15),('Kanchpur',16),('Vulta',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 97: Meshkat Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Meshkat Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Meshkat Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Asad Gate',2),('Khamar Bari',3),('Farmgate',4),('Bangla Motor',5),('Shahbag',6),('Matsya Bhaban',7),('Paltan',8),('Dainik Bangla Moor',9),('Motijheel',10),('Ittefaq Moor',11),('Sayedabad',12),('Jatrabari',13),('Shonir Akhra',14),('Rayerbag',15),('Matuail',16),('Sign Board',17),('Chittagong Road',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 98: Midline Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Midline Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Midline Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Star Kabab',3),('Dhanmondi 15',4),('Jigatola',5),('City College',6),('Science Lab',7),('Bata Signal',8),('Shahbag',9),('Matsya Bhaban',10),('High Court',11),('Press Club',12),('Paltan',13),('Gulistan',14),('Motijheel',15),('Arambagh',16),('Kamalapur',17),('Bashabo',18),('Khilgaon',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 99: Mirpur Metro Services
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mirpur Metro Services'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mirpur Metro Services') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('Science Lab',4),('City College',5),('Kalabagan',6),('Dhanmondi 32',7),('Dhanmondi 27',8),('Asad Gate',9),('College Gate',10),('Shishu Mela',11),('Shyamoli',12),('Kallyanpur',13),('Darussalam',14),('Technical',15),('Bangla College',16),('Tolarbag',17),('Ansar Camp',18),('Mirpur 1',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 100: Mirpur Link
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mirpur Link'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mirpur Link') LIMIT 1), l.id, s.o FROM (VALUES ('ECB Square',1),('Purobi',2),('Mirpur 11',3),('Mirpur 10',4),('Kazipara',5),('Shewra',6),('Agargaon',7),('Khamar Bari',8),('Dhanmondi 27',9),('Dhanmondi 32',10),('City College',11),('New Market',12),('Nilkhet',13),('Azimpur',14)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 101: Mirpur Mission
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mirpur Mission'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mirpur Mission') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Khamar Bari',3),('Farmgate',4),('Press Club',5),('Motijheel',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 102: Mirpur Transport Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mirpur Transport Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mirpur Transport Service') LIMIT 1), l.id, s.o FROM (VALUES ('Gulistan',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Bangla Motor',9),('Kawran Bazar',10),('Farmgate',11),('Khamar Bari',12),('Agargaon',13),('Taltola',14),('Shewra',15),('Kazipara',16),('Mirpur 10',17),('Mirpur 11',18),('Purobi',19),('Pallabi',20),('Mirpur 12',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 103: Mirpur United Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mirpur United Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mirpur United Service') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Bangla Motor',9),('Kawran Bazar',10),('Farmgate',11),('Khamar Bari',12),('Agargaon',13),('Taltola',14),('Shewra',15),('Kazipara',16),('Mirpur 10',17),('Mirpur 11',18),('Purobi',19),('Pallabi',20),('Mirpur 12',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 104: MM Lovely
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'MM Lovely'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'MM Lovely') LIMIT 1), l.id, s.o FROM (VALUES ('Savar',1),('Hemayetpur',2),('Amin Bazar',3),('Gabtoli',4),('Technical',5),('Kallyanpur',6),('Shyamoli',7),('Shishu Mela',8),('College Gate',9),('Asad Gate',10),('Khamar Bari',11),('Farmgate',12),('Kawran Bazar',13),('Bangla Motor',14),('Mogbazar',15),('Mouchak',16),('Malibagh Moor',17),('Rajarbag',18),('Khilgaon Flyover',19),('Bashabo',20),('Mugdapara',21),('Manik Nagar',22),('Golapbag Chourasta',23),('Sayedabad',24),('Janapath Moor',25),('Jatrabari',26),('Kazla',27),('Shonir Akhra',28),('Rayerbag',29),('Matuail',30),('Sign Board',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 105: Modhumita Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Modhumita Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Modhumita Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Sony Cinema Hall',2),('Mirpur 2',3),('Mirpur 1',4),('Ansar Camp',5),('Technical',6),('Kallyanpur',7),('Shyamoli',8),('Shishu Mela',9),('Agargaon',10),('Bijoy Sarani',11),('Jahangir Gate',12),('Mohakhali',13),('Wireless',14),('Gulshan 1',15),('Badda Link Road',16),('Merul',17),('Rampura Bridge',18),('Banasree',19),('Demra Staff Quarter',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 106: Mohona Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Mohona Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Mohona Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Mazar Road',6),('Konabari',7),('Rupnagar',8),('Beribadh',9),('Birulia',10),('Ashulia',11),('Zirabo',12),('Fantasy Kingdom',13)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 107: Moitri Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Moitri Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Moitri Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Star Kabab',3),('Dhanmondi 15',4),('Jigatola',5),('City College',6),('Science Lab',7),('Bata Signal',8),('Shahbag',9),('Matsya Bhaban',10),('High Court',11),('Press Club',12),('Paltan',13),('GPO',14),('Gulistan',15),('Motijheel',16),('Arambagh',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 108: Moumita Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Moumita Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Moumita Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Chashara',1),('Shibu Market',2),('Jalkuri',3),('Sign Board',4),('Matuail',5),('Rayerbag',6),('Shonir Akhra',7),('Jatrabari',8),('Sayedabad',9),('Gulistan',10),('Chankhar Pul',11),('Bakshi Bazar',12),('Azimpur',13),('Nilkhet',14),('New Market',15),('City College',16),('Kalabagan',17),('Dhanmondi 32',18),('Dhanmondi 27',19),('Asad Gate',20),('College Gate',21),('Shishu Mela',22),('Shyamoli',23),('Kallyanpur',24),('Darussalam',25),('Technical',26),('Gabtoli',27),('Amin Bazar',28),('Hemayetpur',29),('Savar',30),('Baipayl',31),('Zirani Bazar',32),('Nandan Park',33),('Chandra',34)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 109: MTCL-2 Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'MTCL-2 Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'MTCL-2 Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Asad Gate',2),('Dhanmondi 27',3),('Dhanmondi 32',4),('Shukrabad',5),('Kalabagan',6),('City College',7),('Science Lab',8),('Bata Signal',9),('Shahbag',10),('Matsya Bhaban',11),('High Court',12),('Press Club',13),('Paltan',14),('GPO',15),('Gulistan',16),('Motijheel',17),('Arambagh',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 110: Nur E Makka
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Nur E Makka'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Nur E Makka') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Sony Cinema Hall',2),('Mirpur 2',3),('Mirpur 10',4),('Mirpur 11',5),('Purobi',6),('Kalshi',7),('ECB Square',8),('MES',9),('Shewra',10),('Kuril Bishwa Road',11),('Jamuna Future Park',12),('Bashundhara',13),('Nadda',14),('Notun Bazar',15),('Bashtola',16),('Shahjadpur',17),('Uttar Badda',18),('Badda',19),('Madhya Badda',20),('Merul',21),('Rampura Bridge',22),('Rampura Bazar',23),('Hazipara',24),('Malibagh Railgate',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 111: Nabakali
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Nabakali'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Nabakali') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Ansar Camp',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('College Gate',8),('Asad Gate',9),('Dhanmondi 27',10),('Shukrabad',11),('Dhanmondi 32',12),('Kalabagan',13),('Science Lab',14),('Katabon',15),('Shahbag',16),('High Court',17),('Fulbaria',18),('Naya Bazar',19),('Babubazar',20),('Keraniganj',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 112: New Vision
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'New Vision'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'New Vision') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Ansar Camp',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('College Gate',8),('Asad Gate',9),('Khamar Bari',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('High Court',15),('Press Club',16),('Paltan',17),('Dainik Bangla Moor',18),('Motijheel',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 113: Nilachol
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Nilachol'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Nilachol') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('Chankhar Pul',9),('Bakshi Bazar',10),('Azimpur',11),('Nilkhet',12),('New Market',13),('City College',14),('Kalabagan',15),('Dhanmondi 32',16),('Dhanmondi 27',17),('Asad Gate',18),('College Gate',19),('Shishu Mela',20),('Shyamoli',21),('Kallyanpur',22),('Darussalam',23),('Technical',24),('Gabtoli',25),('Amin Bazar',26),('Hemayetpur',27),('Savar',28),('Nobinagar',29),('Manikganj',30),('Paturia',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 114: Nishorgo
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Nishorgo'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Nishorgo') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Kazipara',3),('Shewra',4),('Taltola',5),('Agargaon',6),('Asad Gate',7),('Shyamoli',8),('Mohammadpur',9),('Shankar',10),('Dhanmondi 15',11),('Jigatola',12),('Science Lab',13),('New Market',14),('Nilkhet',15),('Eden College',16),('Azimpur',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 115: Omama International
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Omama International'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Omama International') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Dainik Bangla Moor',2),('Paltan',3),('Press Club',4),('Matsya Bhaban',5),('High Court',6),('Shahbag',7),('Bangla Motor',8),('Kawran Bazar',9),('Farmgate',10),('Jahangir Gate',11),('Mohakhali',12),('Chairman Bari',13),('Sainik Club',14),('Banani',15),('Kakali',16),('Staff Road',17),('MES',18),('Shewra',19),('Kuril Bishwa Road',20),('Khilkhet',21),('Airport',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 116: One Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'One Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'One Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Nandan Park',1),('Zirani Bazar',2),('Baipayl',3),('Nobinagar',4),('Savar',5),('Hemayetpur',6),('Amin Bazar',7),('Gabtoli',8),('Technical',9),('Kallyanpur',10),('Shyamoli',11),('Shishu Mela',12),('College Gate',13),('Asad Gate',14),('Khamar Bari',15),('Farmgate',16),('Kawran Bazar',17),('Bangla Motor',18),('Shahbag',19),('High Court',20),('Press Club',21),('Paltan',22),('GPO',23),('Gulistan',24),('Motijheel',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 117: Pallabi Local Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Pallabi Local Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Pallabi Local Service') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Sony Cinema Hall',5),('Mirpur 2',6),('Mirpur 10',7),('Mirpur 11',8),('Purobi',9),('Kalshi',10),('ECB Square',11),('MES',12),('Shewra',13),('Kuril Bishwa Road',14),('Khilkhet',15),('Airport',16),('Jashimuddin',17),('Rajlakshmi',18),('Azampur',19),('House Building',20),('Abdullahpur',21),('Kamarpara',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 118: Paristhan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Paristhan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Paristhan') LIMIT 1), l.id, s.o FROM (VALUES ('Bosila',1),('Mohammadpur',2),('Asad Gate',3),('College Gate',4),('Shyamoli',5),('Kallyanpur',6),('Darussalam',7),('Technical',8),('Bangla College',9),('Tolarbag',10),('Ansar Camp',11),('Mirpur 1',12),('Mirpur 2',13),('Mirpur 10',14),('Mirpur 11',15),('Purobi',16),('Kalshi',17),('ECB Square',18),('MES',19),('Shewra',20),('Kuril Bishwa Road',21),('Khilkhet',22),('Airport',23),('Jashimuddin',24),('Rajlakshmi',25),('House Building',26),('Abdullahpur',27)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 119: Pallabi Super
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Pallabi Super'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Pallabi Super') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Sony Cinema Hall',5),('Mirpur 2',6),('Mirpur 10',7),('Mirpur 11',8),('Purobi',9),('Kalshi',10),('ECB Square',11),('MES',12),('Shewra',13),('Kuril Bishwa Road',14),('Khilkhet',15),('Airport',16),('Jashimuddin',17),('Rajlakshmi',18),('Azampur',19),('House Building',20),('Abdullahpur',21),('Kamarpara',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 120: Power Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Power Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Power Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Mazar Road',6),('Konabari',7),('Rupnagar',8),('Beribadh',9),('Birulia',10),('Ashulia',11),('Zirabo',12),('Narshinghapur',13),('Sura Bari',14),('Kashimpur',15),('Jarun',16),('Konabari',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 121: Prattay
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Prattay'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Prattay') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Beribadh',2),('Hazaribagh',3),('Kamrangirchar',4),('Babubazar',5)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 122: Prochesta
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Prochesta'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Prochesta') LIMIT 1), l.id, s.o FROM (VALUES ('Maowa',1),('Keraniganj',2),('Babubazar',3),('Naya Bazar',4),('Golap Shah Mazar',5),('GPO',6),('Paltan',7),('Kakrail',8),('Shantinagar',9),('Malibagh Moor',10),('Mouchak',11),('Malibagh Railgate',12),('Hazipara',13),('Rampura Bazar',14),('Rampura Bridge',15),('Merul',16),('Badda',17),('Uttar Badda',18),('Shahjadpur',19),('Bashtola',20),('Notun Bazar',21),('Nadda',22),('Bashundhara',23),('Jamuna Future Park',24),('Kuril Bishwa Road',25),('Khilkhet',26),('Airport',27),('Jashimuddin',28),('Rajlakshmi',29),('Azampur',30),('House Building',31),('Abdullahpur',32)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 124: Projapati
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Projapati'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Projapati') LIMIT 1), l.id, s.o FROM (VALUES ('Bosila',1),('Mohammadpur',2),('Asad Gate',3),('College Gate',4),('Shyamoli',5),('Kallyanpur',6),('Darussalam',7),('Technical',8),('Bangla College',9),('Ansar Camp',10),('Mirpur 1',11),('Mirpur 2',12),('Mirpur 10',13),('Mirpur 11',14),('Purobi',15),('Kalshi',16),('ECB Square',17),('MES',18),('Shewra',19),('Kuril Bishwa Road',20),('Khilkhet',21),('Airport',22),('Jashimuddin',23),('Rajlakshmi',24),('House Building',25),('Abdullahpur',26),('Kamarpara',27)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 125: Provati Banasree
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Provati Banasree'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Provati Banasree') LIMIT 1), l.id, s.o FROM (VALUES ('Fulbaria',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Kakrail',5),('Shantinagar',6),('Malibagh Moor',7),('Mogbazar',8),('Satrasta',9),('Nabisco',10),('Mohakhali',11),('Chairman Bari',12),('Banani',13),('Kakali',14),('Staff Road',15),('MES',16),('Shewra',17),('Kuril Bishwa Road',18),('Khilkhet',19),('Airport',20),('Jashimuddin',21),('Rajlakshmi',22),('Azampur',23),('House Building',24),('Abdullahpur',25),('Tongi',26),('Station Road',27),('Mill Gate',28),('Board Bazar',29),('Gazipur Chourasta',30),('Joydebpur',31),('Sreepur',32),('Baromi',33)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 126: Purbachol Logistics
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Purbachol Logistics'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Purbachol Logistics') LIMIT 1), l.id, s.o FROM (VALUES ('Vashantek',1),('Mirpur 14',2),('Mirpur 10',3),('Mirpur 2',4),('Sony Cinema Hall',5),('Mirpur 1',6),('Ansar Camp',7),('Technical',8),('Gabtoli',9),('Amin Bazar',10),('Hemayetpur',11),('Savar',12),('Baipayl',13),('Zirani Bazar',14),('Nandan Park',15),('Chandra',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 127: Raida
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Raida'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Raida') LIMIT 1), l.id, s.o FROM (VALUES ('Postagola',1),('Dholairpar',2),('Jatrabari',3),('Janapath Moor',4),('Sayedabad',5),('Mugdapara',6),('Bashabo',7),('Khilgaon',8),('Malibagh Railgate',9),('Rampura Bazar',10),('Rampura Bridge',11),('Merul',12),('Badda',13),('Uttar Badda',14),('Bashtola',15),('Notun Bazar',16),('Nadda',17),('Bashundhara',18),('Jamuna Future Park',19),('Kuril Bishwa Road',20),('Khilkhet',21),('Airport',22),('Jashimuddin',23),('Rajlakshmi',24),('Azampur',25),('House Building',26),('Diabari',27)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 128: Raja City
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Raja City'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Raja City') LIMIT 1), l.id, s.o FROM (VALUES ('Postagola',1),('Jurain',2),('Dayaganj',3),('Gulistan',4),('GPO',5),('Paltan',6),('Press Club',7),('High Court',8),('Shahbag',9),('Bata Signal',10),('Science Lab',11),('City College',12),('Jigatola',13),('Dhanmondi 15',14),('Star Kabab',15),('Shankar',16),('Mohammadpur',17),('Bosila',18),('Ghatar Char',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 129: Rajanigandha
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rajanigandha'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rajanigandha') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('GPO',9),('Paltan',10),('Press Club',11),('High Court',12),('Shahbag',13),('Bata Signal',14),('Science Lab',15),('Jigatola',16),('Star Kabab',17),('Shankar',18),('Mohammadpur',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 130: Rajdhani Super
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rajdhani Super'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rajdhani Super') LIMIT 1), l.id, s.o FROM (VALUES ('Hemayetpur',1),('Gabtoli',2),('Technical',3),('Ansar Camp',4),('Mirpur 1',5),('Sony Cinema Hall',6),('Mirpur 2',7),('Mirpur 10',8),('Mirpur 11',9),('Purobi',10),('Kalshi',11),('ECB Square',12),('MES',13),('Shewra',14),('Kuril Bishwa Road',15),('Jamuna Future Park',16),('Bashundhara',17),('Nadda',18),('Notun Bazar',19),('Bashtola',20),('Shahjadpur',21),('Uttar Badda',22),('Badda',23),('Madhya Badda',24),('Merul',25),('Rampura Bridge',26),('Banasree',27),('Demra Staff Quarter',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 131: Ramjan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Ramjan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Ramjan') LIMIT 1), l.id, s.o FROM (VALUES ('Shishu Mela',1),('College Gate',2),('Asad Gate',3),('Mohammadpur',4),('Shankar',5),('Star Kabab',6),('Dhanmondi 15',7),('Jigatola',8),('City College',9),('Science Lab',10),('Bata Signal',11),('Shahbag',12),('Matsya Bhaban',13),('Kakrail',14),('Shantinagar',15),('Malibagh Moor',16),('Mouchak',17),('Malibagh Railgate',18),('Hazipara',19),('Rampura Bazar',20),('Rampura Bridge',21),('Banasree',22),('Demra Staff Quarter',23)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 132: Robrob
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Robrob'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Robrob') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Mirpur 2',5),('Mirpur 10',6),('Purobi',7),('Kalshi',8),('ECB Square',9),('MES',10),('Banani',11),('Kakali',12),('Abdullahpur',13),('Badda Link Road',14),('Merul',15),('Rampura Bridge',16),('Banasree',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 133: Rois
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rois'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rois') LIMIT 1), l.id, s.o FROM (VALUES ('Sony Cinema Hall',1),('Mirpur 2',2),('Mirpur 10',3),('Kazipara',4),('Shewra',5),('Agargaon',6),('Mohakhali',7),('Abdullahpur',8),('Badda',9),('Rampura Bridge',10),('Banasree',11)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 134: Rongdhonu Express
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rongdhonu Express'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rongdhonu Express') LIMIT 1), l.id, s.o FROM (VALUES ('Adabor',1),('Mohammadpur',2),('Shia Masjid',3),('Shyamoli',4),('College Gate',5),('Asad Gate',6),('Kalabagan',7),('Science Lab',8),('Katabon',9),('Bata Signal',10),('Shahbag',11),('Kakrail',12),('Fakirapul',13),('Motijheel',14),('Dayaganj',15),('Postagola',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 135: Runway Express
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Runway Express'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Runway Express') LIMIT 1), l.id, s.o FROM (VALUES ('Keraniganj',1),('Kadamtali',2),('Babubazar',3),('Naya Bazar',4),('Golap Shah Mazar',5),('GPO',6),('Paltan',7),('Press Club',8),('High Court',9),('Matsya Bhaban',10),('Shahbag',11),('Bangla Motor',12),('Kawran Bazar',13),('Farmgate',14),('Agargaon',15),('Shewra',16),('Kazipara',17),('Mirpur 10',18),('Mirpur 11',19),('Mirpur 12',20),('ECB Square',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 136: Rupa Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rupa Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rupa Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Sony Cinema Hall',5),('Mirpur 2',6),('Mirpur 10',7),('Mirpur 14',8)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 137: Rupkotha
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Rupkotha'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Rupkotha') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Mirpur 2',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Kalshi',8),('ECB Square',9),('MES',10),('Shewra',11),('Kuril Bishwa Road',12),('Khilkhet',13),('Airport',14),('Jashimuddin',15),('Rajlakshmi',16),('Azampur',17),('House Building',18),('Abdullahpur',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 138: Safety Druti
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Safety Druti'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Safety Druti') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Khamar Bari',10),('Dhanmondi 27',11),('Dhanmondi 32',12),('Kalabagan',13),('City College',14),('New Market',15),('Nilkhet',16),('Azimpur',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 139: Sakalpa Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Sakalpa Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Sakalpa Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Mirpur 2',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Agargaon',8),('Bijoy Sarani',9),('Farmgate',10),('Bangla Motor',11),('Mogbazar',12),('Malibagh Moor',13),('Kamalapur',14)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 140: Salsabil
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Salsabil'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Salsabil') LIMIT 1), l.id, s.o FROM (VALUES ('Postagola',1),('Dholairpar',2),('Jatrabari',3),('Sayedabad',4),('Mugdapara',5),('Bashabo',6),('Khilgaon',7),('Malibagh Railgate',8),('Rampura Bazar',9),('Rampura Bridge',10),('Merul',11),('Badda',12),('Uttar Badda',13),('Bashtola',14),('Notun Bazar',15),('Nadda',16),('Bashundhara',17),('Jamuna Future Park',18),('Kuril Bishwa Road',19),('Khilkhet',20),('Airport',21),('Jashimuddin',22),('Rajlakshmi',23),('Azampur',24),('House Building',25),('Abdullahpur',26),('Tongi',27),('Station Road',28),('Mill Gate',29),('Board Bazar',30),('Gazipur Bypass',31),('Gazipur Chourasta',32)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 141: Savar Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Savar Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Savar Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Science Lab',9),('Kalabagan',10),('Dhanmondi 32',11),('Dhanmondi 27',12),('Asad Gate',13),('College Gate',14),('Shishu Mela',15),('Shyamoli',16),('Kallyanpur',17),('Darussalam',18),('Technical',19),('Gabtoli',20),('Amin Bazar',21),('Hemayetpur',22),('Savar',23),('Baipayl',24),('Zirani Bazar',25),('Nandan Park',26)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 142: Shadhin
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shadhin'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shadhin') LIMIT 1), l.id, s.o FROM (VALUES ('Bosila',1),('Mohammadpur',2),('Asad Gate',3),('Khamar Bari',4),('Farmgate',5),('Kawran Bazar',6),('Bangla Motor',7),('Mogbazar',8),('Mouchak',9),('Malibagh Railgate',10),('Hazipara',11),('Rampura Bazar',12),('Rampura Bridge',13),('Banasree',14),('Demra Staff Quarter',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 143: Shadhin Express
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shadhin Express'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shadhin Express') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Khamar Bari',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('High Court',15),('Press Club',16),('Paltan',17),('GPO',18),('Golap Shah Mazar',19),('Naya Bazar',20),('Babubazar',21),('Keraniganj',22),('Kadamtali',23),('Rajendrapur',24),('Maowa',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 144: Shahria Enterprise
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shahria Enterprise'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shahria Enterprise') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Kallyanpur',3),('Shyamoli',4),('Shishu Mela',5),('College Gate',6),('Asad Gate',7),('Dhanmondi 27',8),('Dhanmondi 32',9),('Shukrabad',10),('Kalabagan',11),('City College',12),('Science Lab',13),('Katabon',14),('Shahbag',15),('Matsya Bhaban',16),('Kakrail',17),('Arambagh',18),('Motijheel',19),('Ittefaq Moor',20),('Tikatuli',21),('Dayaganj',22),('Gandaria',23),('Jurain',24),('Postagola',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 145: Shatabdi
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shatabdi'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shatabdi') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Paltan',2),('Kakrail',3),('Malibagh Moor',4),('Mouchak',5),('Mogbazar',6),('Satrasta',7),('Nabisco',8),('Mohakhali',9),('Chairman Bari',10),('Banani',11),('Kakali',12),('Shewra',13),('Kuril Bishwa Road',14),('Khilkhet',15),('Airport',16),('Jashimuddin',17),('Rajlakshmi',18),('Azampur',19),('House Building',20),('Abdullahpur',21),('Kamarpara',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 146: Shikhor Paribahan 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shikhor Paribahan 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shikhor Paribahan 1') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Bijoy Sarani',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Gulistan',20),('Janapath Moor',21),('Jatrabari',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 147: Shikhor Paribahan 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Shikhor Paribahan 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Shikhor Paribahan 2') LIMIT 1), l.id, s.o FROM (VALUES ('Jatrabari',1),('Sayedabad',2),('Gulistan',3),('GPO',4),('Paltan',5),('Press Club',6),('High Court',7),('Matsya Bhaban',8),('Shahbag',9),('Bangla Motor',10),('Kawran Bazar',11),('Farmgate',12),('Bijoy Sarani',13),('Agargaon',14),('IDB',15),('Taltola',16),('Shewra',17),('Kazipara',18),('Mirpur 10',19),('Mirpur 11',20),('Pallabi',21),('Purobi',22),('Mirpur 12',23)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 148: Suveccha
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Suveccha'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Suveccha') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('Chankhar Pul',9),('Bakshi Bazar',10),('Dhakeshwari',11),('Azimpur',12),('Nilkhet',13),('New Market',14),('City College',15),('Kalabagan',16),('Dhanmondi 32',17),('Dhanmondi 27',18),('Asad Gate',19),('College Gate',20),('Shishu Mela',21),('Shyamoli',22),('Kallyanpur',23),('Darussalam',24),('Technical',25),('Gabtoli',26),('Amin Bazar',27),('Hemayetpur',28),('Savar',29),('Nobinagar',30),('Baipayl',31),('Zirani Bazar',32),('Nandan Park',33),('Chandra',34)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 149: Suvojatri
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Suvojatri'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Suvojatri') LIMIT 1), l.id, s.o FROM (VALUES ('Fulbaria',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Bata Signal',9),('Science Lab',10),('Kalabagan',11),('Dhanmondi 32',12),('Dhanmondi 27',13),('Asad Gate',14),('College Gate',15),('Shishu Mela',16),('Shyamoli',17),('Kallyanpur',18),('Darussalam',19),('Technical',20),('Gabtoli',21),('Amin Bazar',22),('Hemayetpur',23),('Manikganj',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 150: Siam Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Siam Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Siam Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Banasree',1),('Rampura Bridge',2),('Merul',3),('Badda',4),('Shahjadpur',5),('Bashtola',6),('Notun Bazar',7),('Nadda',8),('Bashundhara',9),('Jamuna Future Park',10),('Kuril Bishwa Road',11),('Khilkhet',12),('Airport',13),('Jashimuddin',14),('Rajlakshmi',15),('Azampur',16),('House Building',17),('Abdullahpur',18),('Kamarpara',19),('Dhour',20),('Beribadh',21),('Ashulia',22),('Zirabo',23),('Fantasy Kingdom',24),('Jamgora',25),('Shimultola',26),('Baipayl',27),('Palli Bidyut',28),('Savar Cantonment',29),('Nobinagar',30)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 151: Skyline
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Skyline'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Skyline') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('Naya Bazar',3),('Golap Shah Mazar',4),('GPO',5),('Paltan',6),('Kakrail',7),('Shantinagar',8),('Malibagh Moor',9),('Mouchak',10),('Nabisco',11),('Mohakhali',12),('Chairman Bari',13),('Sainik Club',14),('Banani',15),('Kakali',16),('Staff Road',17),('MES',18),('Shewra',19),('Kuril Bishwa Road',20),('Khilkhet',21),('Airport',22),('Jashimuddin',23),('Rajlakshmi',24),('Azampur',25),('House Building',26),('Abdullahpur',27),('Tongi',28),('Station Road',29),('Mill Gate',30),('Board Bazar',31),('Gazipur Chourasta',32)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 152: Somota Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Somota Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Somota Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('Chankhar Pul',9),('Bakshi Bazar',10),('Dhakeshwari',11),('Azimpur',12),('Nilkhet',13),('New Market',14),('City College',15),('Kalabagan',16),('Dhanmondi 32',17),('Dhanmondi 27',18),('Asad Gate',19),('College Gate',20),('Shishu Mela',21),('Shyamoli',22),('Kallyanpur',23),('Darussalam',24),('Technical',25),('Ansar Camp',26),('Mirpur 1',27),('Abdullahpur',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 153: Somoy
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Somoy'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Somoy') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Matuail',2),('Rayerbag',3),('Shonir Akhra',4),('Jatrabari',5),('Sayedabad',6),('Janapath Moor',7),('Gulistan',8),('GPO',9),('Paltan',10),('Press Club',11),('High Court',12),('Matsya Bhaban',13),('Shahbag',14),('Bangla Motor',15),('Kawran Bazar',16),('Farmgate',17),('Bijoy Sarani',18),('Agargaon',19),('IDB',20),('Taltola',21),('Shewra',22),('Kazipara',23),('Mirpur 10',24),('Mirpur 11',25),('Pallabi',26),('Purobi',27),('Mirpur 12',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 154: Somoy Niyantran
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Somoy Niyantran'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Somoy Niyantran') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Bijoy Sarani',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Golap Shah Mazar',20),('Naya Bazar',21),('Babubazar',22),('Keraniganj',23)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 155: Super
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Super'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Super') LIMIT 1), l.id, s.o FROM (VALUES ('Gulistan',1),('Shahbag',2),('Farmgate',3),('Shyamoli',4),('Gabtoli',5),('Savar',6),('Nobinagar',7)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 156: Supravat
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Supravat'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Supravat') LIMIT 1), l.id, s.o FROM (VALUES ('Victoria Park',1),('Sadarghat',2),('Golap Shah Mazar',3),('GPO',4),('Paltan',5),('Kakrail',6),('Shantinagar',7),('Malibagh Moor',8),('Mouchak',9),('Malibagh Railgate',10),('Hazipara',11),('Rampura Bazar',12),('Rampura Bridge',13),('Merul',14),('Badda',15),('Shahjadpur',16),('Bashtola',17),('Notun Bazar',18),('Nadda',19),('Bashundhara',20),('Jamuna Future Park',21),('Kuril Bishwa Road',22),('Khilkhet',23),('Airport',24),('Jashimuddin',25),('Rajlakshmi',26),('Azampur',27),('House Building',28),('Abdullahpur',29),('Tongi',30)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 157: Swajan Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Swajan Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Swajan Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Savar',1),('Hemayetpur',2),('Amin Bazar',3),('Gabtoli',4),('Technical',5),('Kallyanpur',6),('Shyamoli',7),('Shishu Mela',8),('College Gate',9),('Asad Gate',10),('Khamar Bari',11),('Farmgate',12),('Kawran Bazar',13),('Bangla Motor',14),('Shahbag',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Golap Shah Mazar',20),('Naya Bazar',21),('Sadarghat',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 158: Talukdar
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Talukdar'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Talukdar') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Ansar Camp',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('College Gate',8),('Asad Gate',9),('Khamar Bari',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Mogbazar',14),('Mouchak',15),('Malibagh Moor',16),('Mugdapara',17),('Rajarbag',18),('Khilgaon Flyover',19),('Bashabo',20),('Manik Nagar',21),('Golapbag Chourasta',22),('Sayedabad',23),('Janapath Moor',24),('Jatrabari',25),('Kazla',26),('Shonir Akhra',27),('Rayerbag',28),('Matuail',29),('Sign Board',30),('Sanarpar',31),('Chittagong Road',32)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 159: Tanjil Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Tanjil Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Tanjil Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Ansar Camp',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('College Gate',8),('Asad Gate',9),('Khamar Bari',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('High Court',15),('Press Club',16),('Paltan',17),('GPO',18),('Golap Shah Mazar',19),('Naya Bazar',20),('Sadarghat',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 160: Taranga Plus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Taranga Plus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Taranga Plus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Star Kabab',3),('Dhanmondi 15',4),('Jigatola',5),('City College',6),('Science Lab',7),('Bata Signal',8),('Shahbag',9),('Matsya Bhaban',10),('Kakrail',11),('Shantinagar',12),('Malibagh Moor',13),('Mouchak',14),('Malibagh Railgate',15),('Hazipara',16),('Rampura Bazar',17),('Rampura Bridge',18),('Banasree',19),('South Banasree',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 161: Tetulia
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Tetulia'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Tetulia') LIMIT 1), l.id, s.o FROM (VALUES ('Shia Masjid',1),('Japan Garden City',2),('Ring Road',3),('Adabor',4),('Shyamoli',5),('Shishu Mela',6),('Agargaon',7),('Taltola',8),('Shewra',9),('Kazipara',10),('Mirpur 10',11),('Mirpur 11',12),('Purobi',13),('Pallabi',14),('Kalshi',15),('ECB Square',16),('MES',17),('Shewra',18),('Kuril Bishwa Road',19),('Airport',20),('Jashimuddin',21),('Rajlakshmi',22),('House Building',23),('Abdullahpur',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Total Buses (91-160):' as metric, COUNT(*) as value FROM buses WHERE id NOT IN (SELECT id FROM buses WHERE name_en IN ('Achim Paribahan','Active Paribahan Bus','Agradut Bus','Airport Bangabandhu Avenue','Azmeri Glory Bus','Ajmi Bus','Akash Bus','Akik Bus','Al Makka Bus','Al Madina Plus One Bus','Alif Bus 1','Alif Bus 2','Alif Bus 3','Anabil Super','Arnob Bus','Ashirbad Pahibahan','Ashulia Classic','Asmani Bus','ATCL Bus','Ayat Bus','Bahon Bus','Baishakhi Bus','Balaka Bus','Basumati','Basumati Transport','Best Satabdi','Best Transport','Bhuiyan Paribahan','Bihanga Bus','Bikalpa Auto Service','Bikalpa City Super Service','Bikash Bus','Bikash Paribahan','Bondhu Paribahan','Borak Bus','Bashumoti Bus','Brihottor Mirpur','BRTC Bus 1','BRTC Bus 2','BRTC Bus 3','BRTC Bus 4','BRTC Bus 5','BRTC Bus 6','BRTC Bus 7','BRTC Bus 8','BRTC Bus 9','BRTC Articulated Bus','Cantonment Bus','Cantonment Mini Service','Champion Bus','City Link Bus','D Link Bus','D One Transport Bus','Deepan Bus','Desh Bangla Bus','Dewan Bus','Dhakar Chaka Bus 1','Dhakar Chaka Bus 2','Dhaka Metro Service','Dhaka Paribahan','Dipon','Dip Paribahan','Dishari Bus','Elite Bus','ETC Bus','ETC Transport','Everest Paribahan','Falgun Art Transport','First Ten Bus','FTCL Bus 1','FTCL Bus 2','Gazipur Paribahan','Grameen Bus','Grameen Suveccha','Green Anabil','Green Dhaka','Gulshan Chaka','Hazi Transport','Himachal Bus','Himachal Suveccha','Himalay Bus','Itihash Bus','J M Super Paribahan','Jabale Noor Paribahan 1','Jabale Noor Paribahan 2','Janjabil Bus','Kamal Plus Paribahan','Kanak Bus','Khajababa Bus','Kironmala Paribahan'));
SELECT 'Total Buses Overall:' as metric, COUNT(*) as value FROM buses;
SELECT 'Total Routes Overall:' as metric, COUNT(*) as value FROM bus_routes;
SELECT 'Total Route Stops Overall:' as metric, COUNT(*) as value FROM route_stops;
SELECT 'Total Locations Overall:' as metric, COUNT(*) as value FROM locations;
