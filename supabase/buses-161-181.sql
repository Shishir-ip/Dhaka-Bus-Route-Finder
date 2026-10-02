-- =====================================================
-- Dhaka Bus Finder — BUSES 161-181
-- Complete Routes for 21 Additional Buses
-- =====================================================
-- Run AFTER buses-91-160.sql
-- =====================================================

-- =====================================================
-- STEP 1: ADD NEW LOCATIONS
-- =====================================================
INSERT INTO locations (name_en, name_bn, aliases) VALUES
('Shonbari Sreenagar', 'শনবাড়ি শ্রীনগর', ARRAY['shonbari sreenagar', 'shonbari']),
('Nimtola', 'নিমতলা', ARRAY['nimtola']),
('Kuchimura', 'কুচিমুড়া', ARRAY['kuchimura']),
('Hasnabad', 'হাসনাবাদ', ARRAY['hasnabad']),
('Mirpur 13', 'মিরপুর ১৩', ARRAY['mirpur 13', 'mp13']),
('Kochukhet', 'কচুক্ষেত', ARRAY['kochukhet', 'kochukhet']),
('Workshop', 'ওয়ার্কশপ', ARRAY['workshop']),
('Saudi Colony', 'সৌদি কলোনি', ARRAY['saudi colony']),
('Garrison', 'গ্যারিসন', ARRAY['garrison', 'garrison cantonment']),
('Adamjee School', 'আদমজী স্কুল', ARRAY['adamjee school']),
('Mirpur DOHS', 'মিরপুর ডিওএইচএস', ARRAY['mirpur dohs', 'dohs']),
('Bot Tola', 'বট তলা', ARRAY['bot tola', 'bottola']),
('Balughat', 'বালুঘাট', ARRAY['balughat']),
('Signal', 'সিগন্যাল', ARRAY['signal']),
('CMH', 'সিএমএইচ', ARRAY['cmh']),
('Proshika Moor', 'প্রশিকা মোড়', ARRAY['proshika moor', 'proshika mor']);

-- =====================================================
-- STEP 2: ADD 21 BUSES (161-181)
-- =====================================================
INSERT INTO buses (name_en, name_bn, type, operating_hours) VALUES
('Thikana', 'ঠিকানা', 'Local', '6:00 AM - 10:00 PM'),
('Thikana Express', 'ঠিকানা এক্সপ্রেস', 'Local', '6:00 AM - 10:00 PM'),
('Titas', 'তিতাস', 'Local', '6:00 AM - 10:00 PM'),
('Transilva', 'ট্রান্সিল্ভা', 'Local', '6:00 AM - 10:00 PM'),
('Trust Transport 1', 'ট্রাষ্ট ট্রান্সপোর্ট ১', 'Local', '6:00 AM - 10:00 PM'),
('Trust Transport 2', 'ট্রাষ্ট ট্রান্সপোর্ট ২', 'Local', '6:00 AM - 10:00 PM'),
('Trust Transport 3', 'ট্রাষ্ট ট্রান্সপোর্ট ৩', 'Local', '6:00 AM - 10:00 PM'),
('Trust Transport AC', 'ট্রাষ্ট ট্রান্সপোর্ট এসি', 'AC', '6:00 AM - 10:00 PM'),
('Turag', 'গ্রেট তুরাগ', 'Local', '6:00 AM - 10:00 PM'),
('Victor Classic', 'ভিক্টর ক্লাসিক', 'Local', '6:00 AM - 10:00 PM'),
('Victor Paribahan', 'ভিক্টর পরিবহন', 'Local', '6:00 AM - 10:00 PM'),
('VIP 27', 'ভিআইপি ২৭', 'Local', '6:00 AM - 10:00 PM'),
('Welcome', 'ওয়েলকাম', 'Local', '6:00 AM - 10:00 PM'),
('Winner', 'উইনার', 'Local', '6:00 AM - 10:00 PM'),
('13 No. Bus Route', '১৩নং বাস', 'Local', '6:00 AM - 10:00 PM'),
('4 No. Alike Bus', '৪নং বাস', 'Local', '6:00 AM - 10:00 PM'),
('6 No. Bus Route', '৬নং বাস', 'Local', '6:00 AM - 10:00 PM'),
('6 No. Motijheel Banani', '৬নং মতিঝিল বনানী ট্রান্সপোর্ট', 'Local', '6:00 AM - 10:00 PM'),
('7 No. Bus Route', '৭নং বাস', 'Local', '6:00 AM - 10:00 PM'),
('8 No. Bus Route', '৮নং বাস', 'Local', '6:00 AM - 10:00 PM'),
('9 No. Bus Route', '৯নং বাস', 'Local', '6:00 AM - 10:00 PM');

-- =====================================================
-- STEP 3: ROUTES AND STOPS
-- =====================================================

-- Bus 161: Thikana
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Thikana'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Thikana') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Matuail',2),('Rayerbag',3),('Shonir Akhra',4),('Jatrabari',5),('Sayedabad',6),('Gulistan',7),('Chankhar Pul',8),('Bakshi Bazar',9),('Dhakeshwari',10),('Azimpur',11),('Nilkhet',12),('New Market',13),('City College',14),('Kalabagan',15),('Dhanmondi 32',16),('Dhanmondi 27',17),('Asad Gate',18),('College Gate',19),('Shishu Mela',20),('Shyamoli',21),('Kallyanpur',22),('Darussalam',23),('Technical',24),('Gabtoli',25),('Amin Bazar',26),('Hemayetpur',27),('Savar',28),('Baipayl',29),('Zirani Bazar',30),('Nandan Park',31),('Chandra',32)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 162: Thikana Express
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Thikana Express'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Thikana Express') LIMIT 1), l.id, s.o FROM (VALUES ('Shonbari Sreenagar',1),('Nimtola',2),('Kuchimura',3),('Rajendrapur',4),('Hasnabad',5),('Postagola',6),('Jurain',7),('Dholairpar',8),('Jatrabari',9),('Sayedabad',10),('Gulistan',11),('Chankhar Pul',12),('Bakshi Bazar',13),('Azimpur',14),('Nilkhet',15),('New Market',16),('City College',17),('Kalabagan',18),('Dhanmondi 32',19),('Dhanmondi 27',20),('Asad Gate',21),('College Gate',22),('Shishu Mela',23),('Shyamoli',24),('Kallyanpur',25),('Darussalam',26),('Technical',27),('Gabtoli',28),('Amin Bazar',29),('Hemayetpur',30),('Savar',31),('Baipayl',32),('Zirani Bazar',33),('Nandan Park',34),('Chandra',35)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 163: Titas
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Titas'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Titas') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Gabtoli',3),('Savar',4),('Nobinagar',5),('Chandra',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 164: Transilva
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Transilva'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Transilva') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 1',1),('Ansar Camp',2),('Technical',3),('Kallyanpur',4),('Shyamoli',5),('Shishu Mela',6),('College Gate',7),('Asad Gate',8),('Dhanmondi 27',9),('Dhanmondi 32',10),('Kalabagan',11),('Science Lab',12),('Bata Signal',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Gulistan',20),('Motijheel',21),('Sayedabad',22),('Janapath Moor',23),('Jatrabari',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 165: Trust Transport 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Trust Transport 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Trust Transport 1') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 10',1),('Mirpur 13',2),('Mirpur 14',3),('Kochukhet',4),('Sainik Club',5),('Banani',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 166: Trust Transport 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Trust Transport 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Trust Transport 2') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 10',1),('Mirpur 13',2),('Mirpur 14',3),('Kochukhet',4),('Workshop',5),('Saudi Colony',6),('Jahangir Gate',7),('Farmgate',8),('Kawran Bazar',9),('Bangla Motor',10),('Shahbag',11)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 167: Trust Transport 3
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Trust Transport 3'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Trust Transport 3') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur DOHS',1),('Kalshi',2),('ECB Square',3),('Garrison',4),('Adamjee School',5),('Workshop',6),('Saudi Colony',7),('Jahangir Gate',8),('Farmgate',9),('Kawran Bazar',10),('Bangla Motor',11),('Shahbag',12),('High Court',13),('Press Club',14),('Paltan',15),('Dainik Bangla Moor',16),('Motijheel',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 168: Trust Transport AC
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Trust Transport AC'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Trust Transport AC') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur DOHS',1),('Kalshi',2),('ECB Square',3),('Garrison',4),('Adamjee School',5),('Workshop',6),('Saudi Colony',7),('Jahangir Gate',8),('Farmgate',9),('Kawran Bazar',10)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 169: Turag
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Turag'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Turag') LIMIT 1), l.id, s.o FROM (VALUES ('Jatrabari',1),('Sayedabad',2),('Mugdapara',3),('Bashabo',4),('Khilgaon',5),('Malibagh Moor',6),('Rampura Bazar',7),('Rampura Bridge',8),('Merul',9),('Badda',10),('Uttar Badda',11),('Bashtola',12),('Notun Bazar',13),('Nadda',14),('Bashundhara',15),('Jamuna Future Park',16),('Kuril Bishwa Road',17),('Khilkhet',18),('Airport',19),('Jashimuddin',20),('Rajlakshmi',21),('Azampur',22),('House Building',23),('Abdullahpur',24),('Tongi',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 170: Victor Classic
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Victor Classic'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Victor Classic') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('Naya Bazar',3),('Golap Shah Mazar',4),('GPO',5),('Paltan',6),('Kakrail',7),('Shantinagar',8),('Malibagh Moor',9),('Mouchak',10),('Malibagh Railgate',11),('Hazipara',12),('Rampura Bazar',13),('Rampura Bridge',14),('Merul',15),('Badda',16),('Shahjadpur',17),('Bashtola',18),('Notun Bazar',19),('Nadda',20),('Bashundhara',21),('Jamuna Future Park',22),('Kuril Bishwa Road',23)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 171: Victor Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Victor Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Victor Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('Naya Bazar',3),('Golap Shah Mazar',4),('GPO',5),('Paltan',6),('Kakrail',7),('Shantinagar',8),('Malibagh Moor',9),('Mouchak',10),('Malibagh Railgate',11),('Hazipara',12),('Rampura Bazar',13),('Rampura Bridge',14),('Merul',15),('Badda',16),('Shahjadpur',17),('Bashtola',18),('Notun Bazar',19),('Nadda',20),('Bashundhara',21),('Jamuna Future Park',22),('Kuril Bishwa Road',23)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 172: VIP 27
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'VIP 27'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'VIP 27') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('City College',4),('Kalabagan',5),('Banani',6),('Kakali',7),('MES',8),('Shewra',9),('Kuril Bishwa Road',10),('Khilkhet',11),('Airport',12),('Jashimuddin',13),('Rajlakshmi',14),('Azampur',15),('House Building',16),('Abdullahpur',17),('Tongi',18),('Station Road',19),('Mill Gate',20),('Board Bazar',21),('Gazipur Chourasta',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 173: Welcome
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Welcome'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Welcome') LIMIT 1), l.id, s.o FROM (VALUES ('Nandan Park',1),('Zirani Bazar',2),('Baipayl',3),('Nobinagar',4),('Savar',5),('Hemayetpur',6),('Amin Bazar',7),('Gabtoli',8),('Technical',9),('Kallyanpur',10),('Shyamoli',11),('Shishu Mela',12),('College Gate',13),('Asad Gate',14),('Khamar Bari',15),('Farmgate',16),('Kawran Bazar',17),('Bangla Motor',18),('Shahbag',19),('High Court',20),('Press Club',21),('Paltan',22),('GPO',23),('Gulistan',24),('Motijheel',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 174: Winner
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Winner'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Winner') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Eden College',2),('Nilkhet',3),('New Market',4),('Science Lab',5),('City College',6),('Kalabagan',7),('Panthopoth',8),('Kawran Bazar',9),('Bot Tola',10),('Nabisco',11),('Mohakhali',12),('Wireless',13),('Gulshan 1',14),('Badda',15),('Badda Link Road',16),('Uttar Badda',17),('Shahjadpur',18),('Bashtola',19),('Notun Bazar',20),('Nadda',21),('Bashundhara',22),('Jamuna Future Park',23),('Kuril Bishwa Road',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 175: 13 No. Bus Route
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '13 No. Bus Route'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '13 No. Bus Route') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Star Kabab',3),('Dhanmondi 15',4),('Jigatola',5),('City College',6),('Science Lab',7),('New Market',8),('Nilkhet',9),('Azimpur',10)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 176: 4 No. Alike Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '4 No. Alike Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '4 No. Alike Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Balughat',1),('Signal',2),('CMH',3),('Garrison',4),('Adamjee School',5),('Workshop',6),('Jahangir Gate',7),('Bijoy Sarani',8),('Farmgate',9),('Bangla Motor',10),('Shahbag',11),('Paltan',12),('Gulistan',13),('Motijheel',14)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 177: 6 No. Bus Route
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '6 No. Bus Route'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '6 No. Bus Route') LIMIT 1), l.id, s.o FROM (VALUES ('Kamalapur',1),('Motijheel',2),('Gulistan',3),('GPO',4),('Paltan',5),('Kakrail',6),('Shantinagar',7),('Malibagh Moor',8),('Mouchak',9),('Mogbazar',10),('Kawran Bazar',11),('Farmgate',12),('Jahangir Gate',13),('Bijoy Sarani',14),('Mohakhali',15),('Gulshan 1',16),('Gulshan 2',17),('Notun Bazar',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 178: 6 No. Motijheel Banani
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '6 No. Motijheel Banani'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '6 No. Motijheel Banani') LIMIT 1), l.id, s.o FROM (VALUES ('Kamalapur',1),('Motijheel',2),('Gulistan',3),('GPO',4),('Paltan',5),('Kakrail',6),('Shantinagar',7),('Malibagh Moor',8),('Mouchak',9),('Mogbazar',10),('Kawran Bazar',11),('Farmgate',12),('Jahangir Gate',13),('Bijoy Sarani',14),('Mohakhali',15),('Gulshan 1',16),('Gulshan 2',17),('Notun Bazar',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 179: 7 No. Bus Route
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '7 No. Bus Route'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '7 No. Bus Route') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Kallyanpur',3),('Shyamoli',4),('Shishu Mela',5),('College Gate',6),('Asad Gate',7),('Dhanmondi 27',8),('Dhanmondi 32',9),('Kalabagan',10),('Science Lab',11),('Katabon',12),('Shahbag',13),('High Court',14),('Press Club',15),('Paltan',16),('GPO',17),('Golap Shah Mazar',18),('Gulistan',19),('Naya Bazar',20),('Sadarghat',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 180: 8 No. Bus Route
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '8 No. Bus Route'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '8 No. Bus Route') LIMIT 1), l.id, s.o FROM (VALUES ('Jatrabari',1),('Janapath Moor',2),('Sayedabad',3),('Motijheel',4),('Dainik Bangla Moor',5),('Paltan',6),('Press Club',7),('Matsya Bhaban',8),('High Court',9),('Shahbag',10),('Bangla Motor',11),('Kawran Bazar',12),('Farmgate',13),('Khamar Bari',14),('Asad Gate',15),('College Gate',16),('Shishu Mela',17),('Shyamoli',18),('Kallyanpur',19),('Technical',20),('Gabtoli',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 181: 9 No. Bus Route
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '9 No. Bus Route'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '9 No. Bus Route') LIMIT 1), l.id, s.o FROM (VALUES ('College Gate',1),('Shishu Mela',2),('Shyamoli',3),('Kallyanpur',4),('Darussalam',5),('Technical',6),('Bangla College',7),('Tolarbag',8),('Ansar Camp',9),('Mirpur 1',10),('Sony Cinema Hall',11),('Mirpur 2',12),('Proshika Moor',13),('Pallabi',14),('Mirpur 12',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Total Buses (161-181):' as metric, 21 as value;
SELECT 'Total Buses Overall:' as metric, COUNT(*) as value FROM buses;
SELECT 'Total Routes Overall:' as metric, COUNT(*) as value FROM bus_routes;
SELECT 'Total Route Stops Overall:' as metric, COUNT(*) as value FROM route_stops;
SELECT 'Total Locations Overall:' as metric, COUNT(*) as value FROM locations;
