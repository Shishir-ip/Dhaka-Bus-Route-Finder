-- =====================================================
-- Dhaka Bus Finder — COMPLETE ROUTES FOR ALL 90 BUSES
-- =====================================================
-- Run AFTER data-import-90-buses.sql
-- =====================================================

-- Bus 1: Achim Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Achim Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Achim Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Sony Cinema Hall',5),('Mirpur 2',6),('Mirpur 10',7),('Mirpur 11',8),('Purobi',9),('Kalshi',10),('ECB Square',11),('MES',12),('Shewra',13),('Kuril Bishwa Road',14),('Jamuna Future Park',15),('Bashundhara',16),('Nadda',17),('Notun Bazar',18),('Bashtola',19),('Shahjadpur',20),('Uttar Badda',21),('Madhya Badda',22),('Merul',23),('Rampura Bridge',24),('Banasree',25),('Demra Staff Quarter',26)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 2: Active Paribahan Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Active Paribahan Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Active Paribahan Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Shyamoli',1),('Technical',2),('Ansar Camp',3),('Mirpur 1',4),('Sony Cinema Hall',5),('Mirpur 2',6),('Mirpur 10',7),('Mirpur 11',8),('Purobi',9),('Kalshi',10),('ECB Square',11),('MES',12),('Shewra',13),('Kuril Bishwa Road',14),('Khilkhet',15),('Airport',16),('Jashimuddin',17),('Rajlakshmi',18),('Azampur',19),('House Building',20),('Abdullahpur',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 3: Agradut Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Agradut Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Agradut Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Savar',1),('Hemayetpur',2),('Amin Bazar',3),('Gabtoli',4),('Technical',5),('Kallyanpur',6),('Shyamoli',7),('Shishu Mela',8),('Agargaon',9),('Zia Uddyan',10),('Bijoy Sarani',11),('Jahangir Gate',12),('Mohakhali',13),('Wireless',14),('Gulshan 1',15),('Badda Link Road',16),('Bashtola',17),('Shahjadpur',18),('Uttar Badda',19),('Notun Bazar',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 4: Airport Bangabandhu Avenue
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Airport Bangabandhu Avenue'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Airport Bangabandhu Avenue') LIMIT 1), l.id, s.o FROM (VALUES ('Golap Shah Mazar',1),('GPO',2),('Paltan',3),('Press Club',4),('High Court',5),('Matsya Bhaban',6),('Shahbag',7),('Bangla Motor',8),('Kawran Bazar',9),('Farmgate',10),('Bijoy Sarani',11),('Jahangir Gate',12),('Mohakhali',13),('Chairman Bari',14),('Sainik Club',15),('Banani',16),('Kakali',17),('Staff Road',18),('MES',19),('Shewra',20),('Kuril Bishwa Road',21),('Khilkhet',22),('Airport',23),('Jashimuddin',24),('Rajlakshmi',25),('Azampur',26),('House Building',27),('Abdullahpur',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 5: Azmeri Glory Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Azmeri Glory Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Azmeri Glory Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Sadarghat',1),('Golap Shah Mazar',2),('GPO',3),('Paltan',4),('Kakrail',5),('Shantinagar',6),('Malibagh Moor',7),('Mouchak',8),('Nabisco',9),('Mohakhali',10),('Sainik Club',11),('Banani',12),('Kakali',13),('Staff Road',14),('MES',15),('Shewra',16),('Kuril Bishwa Road',17),('Khilkhet',18),('Airport',19),('Jashimuddin',20),('Rajlakshmi',21),('Azampur',22),('House Building',23),('Abdullahpur',24),('Tongi',25),('Station Road',26),('Mill Gate',27),('Board Bazar',28),('Gazipur Bypass',29),('Konabari',30),('Chandra',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 6: Ajmi Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Ajmi Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Ajmi Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Dhamrai',1),('Savar',2),('Hemayetpur',3),('Amin Bazar',4),('Gabtoli',5),('Technical',6),('Kallyanpur',7),('Shyamoli',8),('Shishu Mela',9),('College Gate',10),('Asad Gate',11),('Dhanmondi 27',12),('Dhanmondi 32',13),('Kalabagan',14),('City College',15),('New Market',16),('Nilkhet',17),('Azimpur',18),('Bakshi Bazar',19),('Gulistan',20),('Chittagong Road',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 7: Akash Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Akash Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Akash Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Kadamtali',1),('Keraniganj',2),('Babubazar',3),('Golap Shah Mazar',4),('GPO',5),('Paltan',6),('Kakrail',7),('Shantinagar',8),('Malibagh Moor',9),('Mouchak',10),('Malibagh Railgate',11),('Hazipara',12),('Rampura Bazar',13),('Rampura Bridge',14),('Merul',15),('Badda',16),('Shahjadpur',17),('Bashtola',18),('Notun Bazar',19),('Nadda',20),('Bashundhara',21),('Jamuna Future Park',22),('Kuril Bishwa Road',23),('Khilkhet',24),('Airport',25),('Jashimuddin',26),('Rajlakshmi',27),('Azampur',28),('House Building',29),('Abdullahpur',30),('Tongi',31)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 8: Akik Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Akik Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Akik Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Ansar Camp',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Mirpur 2',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Kalshi',8),('ECB Square',9),('MES',10),('Shewra',11),('Kuril Bishwa Road',12),('Jamuna Future Park',13),('Bashundhara',14),('Nadda',15),('Notun Bazar',16),('Bashtola',17),('Shahjadpur',18),('Uttar Badda',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 9: Al Makka Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Al Makka Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Al Makka Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Gulistan',2),('GPO',3),('Paltan',4),('Kakrail',5),('Shantinagar',6),('Malibagh Moor',7),('Mouchak',8),('Mogbazar',9),('Nabisco',10),('Mohakhali',11),('Chairman Bari',12),('Kakali',13),('Banani',14),('ECB Square',15),('Kalshi',16),('Purobi',17),('Mirpur 10',18),('Mirpur 2',19),('Mirpur 1',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 10: Al Madina Plus One Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Al Madina Plus One Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Al Madina Plus One Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Nandan Park',1),('Zirani Bazar',2),('Baipayl',3),('Nobinagar',4),('Savar',5),('Hemayetpur',6),('Amin Bazar',7),('Gabtoli',8),('Technical',9),('Kallyanpur',10),('Shyamoli',11),('Shishu Mela',12),('College Gate',13),('Asad Gate',14),('Khamar Bari',15),('Farmgate',16),('Kawran Bazar',17),('Bangla Motor',18),('Shahbag',19),('High Court',20),('Press Club',21),('Paltan',22),('GPO',23),('Gulistan',24),('Motijheel',25),('Kamalapur',26)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 11: Alif Bus 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Alif Bus 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Alif Bus 1') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Konabari',6),('Rupnagar',7),('Beribadh',8),('Birulia',9),('Ashulia',10),('Zirabo',11),('Fantasy Kingdom',12)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 12: Alif Bus 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Alif Bus 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Alif Bus 2') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 1',1),('Mirpur 2',2),('Mirpur 10',3),('Kazipara',4),('Shewra',5),('Agargaon',6),('Bijoy Sarani',7),('Jahangir Gate',8),('Mohakhali',9),('Wireless',10),('Gulshan 1',11),('Badda Link Road',12),('Madhya Badda',13),('Merul',14),('Rampura Bridge',15),('Banasree',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 13: Alif Bus 3
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Alif Bus 3'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Alif Bus 3') LIMIT 1), l.id, s.o FROM (VALUES ('Japan Garden City',1),('Ring Road',2),('Adabor',3),('Shyamoli',4),('Shishu Mela',5),('Agargaon',6),('Zia Uddyan',7),('Bijoy Sarani',8),('Jahangir Gate',9),('Mohakhali',10),('Chairman Bari',11),('Sainik Club',12),('Kakali',13),('Banani',14),('Staff Road',15),('MES',16),('Shewra',17),('Kuril Bishwa Road',18),('Khilkhet',19),('Airport',20),('Jashimuddin',21),('Rajlakshmi',22),('Azampur',23),('House Building',24),('Abdullahpur',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 14: Anabil Super
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Anabil Super'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Anabil Super') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Shonir Akhra',2),('Jatrabari',3),('Sayedabad',4),('Mugdapara',5),('Bashabo',6),('Khilgaon',7),('Malibagh Railgate',8),('Hazipara',9),('Rampura Bazar',10),('Rampura Bridge',11),('Merul',12),('Badda',13),('Uttar Badda',14),('Shahjadpur',15),('Bashtola',16),('Notun Bazar',17),('Nadda',18),('Bashundhara',19),('Jamuna Future Park',20),('Kuril Bishwa Road',21),('Khilkhet',22),('Airport',23),('Jashimuddin',24),('Rajlakshmi',25),('Azampur',26),('House Building',27),('Abdullahpur',28),('Tongi',29),('Station Road',30),('Mill Gate',31),('Board Bazar',32),('Gazipur Bypass',33),('Gazipur Chourasta',34)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 15: Arnob Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Arnob Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Arnob Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Hemayetpur',1),('Amin Bazar',2),('Gabtoli',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('Agargaon',8),('Zia Uddyan',9),('Bijoy Sarani',10),('Jahangir Gate',11),('Mohakhali',12),('Wireless',13),('Gulshan 1',14),('Badda Link Road',15),('Madhya Badda',16),('Merul',17),('Rampura Bridge',18),('Banasree',19),('Demra Staff Quarter',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 16-90: Continuing pattern for all remaining buses
-- Due to space, remaining buses follow same INSERT pattern
-- Use the generate-routes-sql.js script to regenerate if needed

-- Bus 16: Ashirbad Pahibahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Ashirbad Pahibahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Ashirbad Pahibahan') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('City College',4),('Kalabagan',5),('Dhanmondi 32',6),('Dhanmondi 27',7),('Shukrabad',8),('Asad Gate',9),('College Gate',10),('Shishu Mela',11),('Kallyanpur',12),('Shyamoli',13),('Technical',14),('Ansar Camp',15),('Mirpur 1',16),('Mirpur 2',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 17: Ashulia Classic
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Ashulia Classic'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Ashulia Classic') LIMIT 1), l.id, s.o FROM (VALUES ('Nobinagar',1),('Baipayl',2),('Fantasy Kingdom',3),('Zirabo',4),('Abdullahpur',5),('House Building',6),('Azampur',7),('Rajlakshmi',8),('Jashimuddin',9),('Airport',10),('Khilkhet',11),('Kuril Bishwa Road',12),('Shewra',13),('MES',14),('Kakali',15),('Banani',16),('Chairman Bari',17),('Mohakhali',18),('Nabisco',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 18: Asmani Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Asmani Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Asmani Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Abdullahpur',1),('House Building',2),('Azampur',3),('Rajlakshmi',4),('Jashimuddin',5),('Airport',6),('Khilkhet',7),('Kuril Bishwa Road',8),('Jamuna Future Park',9),('Bashundhara',10),('Nadda',11),('Notun Bazar',12),('Bashtola',13),('Shahjadpur',14),('Uttar Badda',15),('Badda',16),('Madhya Badda',17),('Merul',18),('Rampura Bridge',19),('Banasree',20),('Demra Staff Quarter',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 19: ATCL Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'ATCL Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'ATCL Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Asad Gate',2),('Shukrabad',3),('Kalabagan',4),('City College',5),('Science Lab',6),('Bata Signal',7),('Shahbag',8),('Matsya Bhaban',9),('High Court',10),('Press Club',11),('Paltan',12),('GPO',13),('Gulistan',14),('Arambagh',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 20: Ayat Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Ayat Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Ayat Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Sony Cinema Hall',2),('Mirpur 2',3),('Mirpur 10',4),('Kazipara',5),('Shewra',6),('Taltola',7),('Agargaon',8),('Khamar Bari',9),('Farmgate',10),('Kawran Bazar',11),('Bangla Motor',12),('Mogbazar',13),('Mouchak',14),('Malibagh Moor',15),('Kamalapur',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 21: Bahon Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bahon Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bahon Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Mirpur 1',4),('Ansar Camp',5),('Technical',6),('Darussalam',7),('Kallyanpur',8),('Shyamoli',9),('Asad Gate',10),('Dhanmondi 27',11),('Dhanmondi 32',12),('Kalabagan',13),('Science Lab',14),('Katabon',15),('Shahbag',16),('High Court',17),('Press Club',18),('Paltan',19),('Motijheel',20),('Arambagh',21),('Kamalapur',22),('Mugdapara',23),('Bashabo',24),('Khilgaon',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 22: Baishakhi Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Baishakhi Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Baishakhi Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Savar',1),('Hemayetpur',2),('Amin Bazar',3),('Gabtoli',4),('Technical',5),('Kallyanpur',6),('Shyamoli',7),('Shishu Mela',8),('Agargaon',9),('Bijoy Sarani',10),('Jahangir Gate',11),('Mohakhali',12),('Gulshan 1',13),('Badda Link Road',14),('Bashtola',15),('Uttar Badda',16),('Notun Bazar',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 23: Balaka Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Balaka Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Balaka Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Sayedabad',1),('Kamalapur',2),('Malibagh Moor',3),('Mouchak',4),('Mogbazar',5),('Satrasta',6),('Nabisco',7),('Mohakhali',8),('Chairman Bari',9),('Banani',10),('Kakali',11),('Staff Road',12),('MES',13),('Shewra',14),('Kuril Bishwa Road',15),('Khilkhet',16),('Airport',17),('Jashimuddin',18),('Rajlakshmi',19),('Azampur',20),('House Building',21),('Abdullahpur',22),('Tongi',23),('Station Road',24),('Mill Gate',25),('Board Bazar',26),('Gazipur Bypass',27),('Gazipur Chourasta',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 24: Basumati
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Basumati'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Basumati') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Technical',2),('Kallyanpur',3),('Shyamoli',4),('Shishu Mela',5),('College Gate',6),('Asad Gate',7),('Khamar Bari',8),('Farmgate',9),('Kawran Bazar',10),('Bangla Motor',11),('Shahbag',12),('Matsya Bhaban',13),('High Court',14),('Press Club',15),('Paltan',16),('GPO',17),('Golap Shah Mazar',18),('Babubazar',19),('Keraniganj',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 25: Basumati Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Basumati Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Basumati Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Mirpur 2',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Kalshi',8),('ECB Square',9),('MES',10),('Shewra',11),('Kuril Bishwa Road',12),('Khilkhet',13),('Airport',14),('Jashimuddin',15),('Rajlakshmi',16),('Azampur',17),('House Building',18),('Abdullahpur',19),('Tongi',20),('Station Road',21),('Mill Gate',22),('Board Bazar',23),('Gazipur Chourasta',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 26: Best Satabdi
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Best Satabdi'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Best Satabdi') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('City College',4),('Kalabagan',5),('Dhanmondi 32',6),('Dhanmondi 27',7),('Khamar Bari',8),('Farmgate',9),('Jahangir Gate',10),('Mohakhali',11),('Chairman Bari',12),('Sainik Club',13),('Banani',14),('Kakali',15),('Staff Road',16),('MES',17),('Shewra',18),('Kuril Bishwa Road',19),('Khilkhet',20),('Airport',21),('Jashimuddin',22),('Rajlakshmi',23),('Azampur',24),('House Building',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 27: Best Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Best Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Best Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 10',1),('Kazipara',2),('Shewra',3),('Taltola',4),('Agargaon',5),('Khamar Bari',6),('Farmgate',7),('Kawran Bazar',8),('Bangla Motor',9),('Shahbag',10),('Matsya Bhaban',11),('High Court',12),('Press Club',13),('Paltan',14),('GPO',15),('Gulistan',16),('Motijheel',17),('Sayedabad',18),('Jatrabari',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 28: Bhuiyan Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bhuiyan Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bhuiyan Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Japan Garden City',1),('Ring Road',2),('Adabor',3),('Shyamoli',4),('Shishu Mela',5),('Agargaon',6),('Zia Uddyan',7),('Bijoy Sarani',8),('Jahangir Gate',9),('Mohakhali',10),('Chairman Bari',11),('Sainik Club',12),('Kakali',13),('Banani',14),('Staff Road',15),('MES',16),('Shewra',17),('Kuril Bishwa Road',18),('Khilkhet',19),('Airport',20),('Jashimuddin',21),('Rajlakshmi',22),('Azampur',23),('House Building',24),('Abdullahpur',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 29: Bihanga Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bihanga Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bihanga Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Mirpur 11',2),('Mirpur 10',3),('Kazipara',4),('Shewra',5),('Agargaon',6),('Bijoy Sarani',7),('Jahangir Gate',8),('Mohakhali',9),('Wireless',10),('Gulshan 1',11),('Badda',12),('Notun Bazar',13)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 30: Bikalpa Auto Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bikalpa Auto Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bikalpa Auto Service') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 1',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Bijoy Sarani',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Gulistan',20),('Motijheel',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 31-90 follow the same pattern. For brevity, remaining buses
-- can be generated using: node scripts/generate-routes-sql.js

-- Bus 31: Bikalpa City Super Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bikalpa City Super Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bikalpa City Super Service') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 11',4),('Mirpur 10',5),('Kazipara',6),('Shewra',7),('Taltola',8),('Agargaon',9),('Shyamoli',10),('Shishu Mela',11),('College Gate',12),('Asad Gate',13),('Dhanmondi 27',14),('Dhanmondi 32',15),('Kalabagan',16),('City College',17),('New Market',18),('Nilkhet',19),('Azimpur',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 32: Bikash Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bikash Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bikash Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('City College',4),('Kalabagan',5),('Dhanmondi 27',6),('Dhanmondi 32',7),('Khamar Bari',8),('Farmgate',9),('Jahangir Gate',10),('Mohakhali',11),('Sainik Club',12),('Banani',13),('Kakali',14),('Kuril Bishwa Road',15),('Khilkhet',16),('Airport',17),('Abdullahpur',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 33: Bikash Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bikash Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bikash Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Matuail',2),('Rayerbag',3),('Shonir Akhra',4),('Jatrabari',5),('Sayedabad',6),('Gulistan',7),('Chankhar Pul',8),('Bakshi Bazar',9),('Azimpur',10),('Nilkhet',11),('New Market',12),('City College',13),('Kalabagan',14),('Dhanmondi 32',15),('Dhanmondi 27',16),('Khamar Bari',17),('Farmgate',18),('Jahangir Gate',19),('Mohakhali',20),('Chairman Bari',21),('Sainik Club',22),('Banani',23),('Kakali',24),('Staff Road',25),('MES',26),('Shewra',27),('Kuril Bishwa Road',28),('Khilkhet',29),('Airport',30),('Jashimuddin',31),('Rajlakshmi',32),('Azampur',33),('House Building',34),('Abdullahpur',35)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 34: Bondhu Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bondhu Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bondhu Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Gulistan',1),('GPO',2),('Paltan',3),('Kakrail',4),('Shantinagar',5),('Malibagh Moor',6),('Mouchak',7),('Malibagh Railgate',8),('Hazipara',9),('Rampura Bazar',10),('Rampura Bridge',11),('Merul',12),('Badda',13),('Shahjadpur',14),('Bashtola',15),('Notun Bazar',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 35-90: Continue same pattern for remaining buses
-- Full data available in scripts/generate-routes-sql.js

-- Bus 35: Borak Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Borak Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Borak Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Palashi',1),('Meghna Ghat',2)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 36: Bashumoti Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Bashumoti Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Bashumoti Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Gazipur Chourasta',1),('Tongi',2),('Airport',3),('Khilkhet',4),('Kalshi',5),('Pallabi',6),('Mirpur 11',7),('Mirpur 10',8),('Mirpur 1',9),('Gabtoli',10)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 37: Brihottor Mirpur
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Brihottor Mirpur'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Brihottor Mirpur') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Gabtoli',3),('Amin Bazar',4),('Savar',5),('Nobinagar',6),('Chandra',7)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 38: BRTC Bus 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 1') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('GPO',9),('Paltan',10),('Press Club',11),('High Court',12),('Matsya Bhaban',13),('Shahbag',14),('Bangla Motor',15),('Kawran Bazar',16),('Farmgate',17),('Khamar Bari',18),('Asad Gate',19),('College Gate',20),('Shishu Mela',21),('Shyamoli',22),('Kallyanpur',23),('Technical',24),('Gabtoli',25),('Amin Bazar',26),('Hemayetpur',27),('Savar',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 39: BRTC Bus 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 2') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Gulistan',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Bangla Motor',9),('Kawran Bazar',10),('Farmgate',11),('Jahangir Gate',12),('Mohakhali',13),('Chairman Bari',14),('Kakali',15),('Banani',16),('Staff Road',17),('MES',18),('Shewra',19),('Kuril Bishwa Road',20),('Khilkhet',21),('Airport',22),('Jashimuddin',23),('Rajlakshmi',24),('Azampur',25),('House Building',26),('Abdullahpur',27),('Tongi',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 40: BRTC Bus 3
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 3'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 3') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Gulistan',2),('GPO',3),('Paltan',4),('Press Club',5),('High Court',6),('Matsya Bhaban',7),('Shahbag',8),('Bangla Motor',9),('Kawran Bazar',10),('Farmgate',11),('Khamar Bari',12),('Asad Gate',13),('College Gate',14),('Shishu Mela',15),('Shyamoli',16),('Kallyanpur',17),('Technical',18),('Gabtoli',19),('Amin Bazar',20),('Hemayetpur',21),('Baipayl',22),('Zirani Bazar',23),('Chandra',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 41: BRTC Bus 4
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 4'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 4') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Asad Gate',2),('Khamar Bari',3),('Farmgate',4),('Jahangir Gate',5),('Mohakhali',6),('Wireless',7),('Gulshan 1',8),('Badda Link Road',9),('Uttar Badda',10),('Shahjadpur',11),('Bashtola',12),('Notun Bazar',13),('Nadda',14),('Bashundhara',15),('Jamuna Future Park',16),('Kuril Bishwa Road',17)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 42: BRTC Bus 5
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 5'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 5') LIMIT 1), l.id, s.o FROM (VALUES ('Kamalapur',1),('Motijheel',2),('Gulistan',3),('GPO',4),('Paltan',5),('Press Club',6),('High Court',7),('Matsya Bhaban',8),('Shahbag',9),('Bangla Motor',10),('Kawran Bazar',11),('Farmgate',12),('Jahangir Gate',13),('Mohakhali',14),('Wireless',15),('Gulshan 1',16),('Badda Link Road',17),('Uttar Badda',18),('Shahjadpur',19),('Bashtola',20),('Notun Bazar',21),('Nadda',22),('Bashundhara',23),('Jamuna Future Park',24),('Kuril Bishwa Road',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 43: BRTC Bus 6
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 6'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 6') LIMIT 1), l.id, s.o FROM (VALUES ('Bashundhara 300 Feet Gate',1),('Kuril Bishwa Road',2)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 44: BRTC Bus 7
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 7'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 7') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Gulistan',2),('GPO',3),('Paltan',4),('Kakrail',5),('Shantinagar',6),('Malibagh Moor',7),('Mouchak',8),('Malibagh Railgate',9),('Hazipara',10),('Rampura Bazar',11),('Rampura Bridge',12),('Merul',13),('Badda',14),('Shahjadpur',15),('Bashtola',16),('Notun Bazar',17),('Nadda',18),('Bashundhara',19),('Jamuna Future Park',20),('Kuril Bishwa Road',21),('Khilkhet',22),('Airport',23),('Jashimuddin',24),('Rajlakshmi',25),('Azampur',26),('House Building',27),('Abdullahpur',28)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 45: BRTC Bus 8
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 8'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 8') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Dhanmondi 15',3),('Jigatola',4),('City College',5),('Science Lab',6),('Bata Signal',7),('Shahbag',8),('Matsya Bhaban',9),('High Court',10),('Press Club',11),('Paltan',12),('GPO',13),('Gulistan',14),('Motijheel',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 46: BRTC Bus 9
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Bus 9'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Bus 9') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Mirpur 2',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Kalshi',8),('ECB Square',9),('MES',10),('Shewra',11),('Kuril Bishwa Road',12),('Khilkhet',13),('Airport',14),('Jashimuddin',15),('Rajlakshmi',16),('Azampur',17),('House Building',18),('Abdullahpur',19),('Tongi',20),('Mill Gate',21),('Board Bazar',22),('Gazipur Bypass',23),('Gazipur Chourasta',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 47: BRTC Articulated Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'BRTC Articulated Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'BRTC Articulated Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Bijoy Sarani',1),('Farmgate',2),('Bangla Motor',3),('Shahbag',4),('Paltan',5),('Gulistan',6),('Motijheel',7)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 48: Cantonment Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Cantonment Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Cantonment Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Ansar Camp',6),('Technical',7),('Gabtoli',8),('Amin Bazar',9),('Hemayetpur',10),('Savar',11)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 49: Cantonment Mini Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Cantonment Mini Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Cantonment Mini Service') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Sainik Club',2),('Kakali',3),('Banani',4),('Mohakhali',5)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 50: Champion Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Champion Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Champion Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Vashantek',1),('Mirpur 14',2),('Mirpur 10',3),('Mirpur 2',4),('Sony Cinema Hall',5),('Mirpur 1',6),('Ansar Camp',7),('Technical',8),('Gabtoli',9)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 51: City Link Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'City Link Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'City Link Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('GPO',9),('Paltan',10),('Press Club',11),('High Court',12),('Matsya Bhaban',13),('Shahbag',14),('Bata Signal',15),('Science Lab',16),('City College',17),('Jigatola',18),('Dhanmondi 15',19),('Shankar',20),('Mohammadpur',21),('Bosila',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 52: D Link Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'D Link Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'D Link Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Fulbaria',1),('Chankhar Pul',2),('Bakshi Bazar',3),('Azimpur',4),('Nilkhet',5),('New Market',6),('City College',7),('Kalabagan',8),('Dhanmondi 32',9),('Dhanmondi 27',10),('Asad Gate',11),('College Gate',12),('Shishu Mela',13),('Shyamoli',14),('Kallyanpur',15),('Darussalam',16),('Technical',17),('Gabtoli',18),('Amin Bazar',19),('Hemayetpur',20),('Savar',21)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 53: D One Transport Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'D One Transport Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'D One Transport Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Paltan',2),('Press Club',3),('Matsya Bhaban',4),('High Court',5),('Shahbag',6),('Bangla Motor',7),('Kawran Bazar',8),('Farmgate',9),('Asad Gate',10),('College Gate',11),('Shishu Mela',12),('Shyamoli',13),('Kallyanpur',14),('Technical',15),('Gabtoli',16),('Amin Bazar',17),('Nobinagar',18),('Dhamrai',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 54: Deepan Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Deepan Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Deepan Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Shankar',1),('Dhanmondi 15',2),('Jigatola',3),('City College',4),('Science Lab',5),('Shahbag',6),('Matsya Bhaban',7),('Paltan',8),('Gulistan',9),('Motijheel',10),('Arambagh',11)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 55: Desh Bangla Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Desh Bangla Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Desh Bangla Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Postagola',1),('Jatrabari',2),('Sayedabad',3),('Mugdapara',4),('Bashabo',5),('Khilgaon',6),('Rampura Bazar',7),('Rampura Bridge',8),('Merul',9),('Badda',10),('Uttar Badda',11),('Bashtola',12),('Notun Bazar',13),('Nadda',14),('Bashundhara',15),('Jamuna Future Park',16),('Kuril Bishwa Road',17),('Khilkhet',18),('Airport',19),('Jashimuddin',20),('Rajlakshmi',21),('Azampur',22),('House Building',23),('Abdullahpur',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 56: Dewan Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dewan Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dewan Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('Science Lab',4),('City College',5),('Katabon',6),('Shahbag',7),('Bangla Motor',8),('Kawran Bazar',9),('Farmgate',10),('Jahangir Gate',11),('Mohakhali',12),('Wireless',13),('Gulshan 1',14),('Badda',15),('Badda Link Road',16),('Uttar Badda',17),('Shahjadpur',18),('Bashtola',19),('Notun Bazar',20),('Nadda',21),('Bashundhara',22),('Jamuna Future Park',23),('Kuril Bishwa Road',24)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 57: Dhakar Chaka Bus 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dhakar Chaka Bus 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dhakar Chaka Bus 1') LIMIT 1), l.id, s.o FROM (VALUES ('Gulshan 1',1),('Gulshan 2',2)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 58: Dhakar Chaka Bus 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dhakar Chaka Bus 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dhakar Chaka Bus 2') LIMIT 1), l.id, s.o FROM (VALUES ('Banani',1),('Gulshan 2',2),('Notun Bazar',3)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 59: Dhaka Metro Service
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dhaka Metro Service'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dhaka Metro Service') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 1',1),('Kallyanpur',2),('Shyamoli',3),('Asad Gate',4),('Kalabagan',5),('Science Lab',6),('New Market',7),('Nilkhet',8),('Azimpur',9)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 60: Dhaka Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dhaka Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dhaka Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Gulistan',1),('Shahbag',2),('Farmgate',3),('Banani',4),('Uttara',5),('Gazipur',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 61: Dipon
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dipon'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dipon') LIMIT 1), l.id, s.o FROM (VALUES ('Shankar',1),('Dhanmondi 15',2),('Jigatola',3),('City College',4),('Science Lab',5),('Bata Signal',6),('Shahbag',7),('Matsya Bhaban',8),('High Court',9),('Press Club',10),('Paltan',11),('Baitul Mukarram',12),('Gulistan',13),('Motijheel',14),('Arambagh',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 62: Dip Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dip Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dip Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('City College',2),('Kalabagan',3),('Kawran Bazar',4),('Nabisco',5),('Gulshan 1',6),('Kuril Bishwa Road',7)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 63: Dishari Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Dishari Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Dishari Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Ansar Camp',3),('Technical',4),('Kallyanpur',5),('Shyamoli',6),('Shishu Mela',7),('College Gate',8),('Asad Gate',9),('Khamar Bari',10),('Farmgate',11),('Kawran Bazar',12),('Bangla Motor',13),('Shahbag',14),('Matsya Bhaban',15),('High Court',16),('Press Club',17),('Paltan',18),('GPO',19),('Golap Shah Mazar',20),('Babubazar',21),('Keraniganj',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 64: Elite Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Elite Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Elite Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Agargaon',1),('Taltola',2),('Shewra',3),('Kazipara',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Pallabi',8),('Kalshi',9),('Kuril Bishwa Road',10),('Airport',11),('Jashimuddin',12),('Rajlakshmi',13),('House Building',14),('Abdullahpur',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 65: ETC Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'ETC Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'ETC Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Golap Shah Mazar',1),('Shahbag',2),('Bangla Motor',3),('Farmgate',4),('Agargaon',5),('Shewra',6),('Kazipara',7),('Mirpur 10',8),('Pallabi',9),('Mirpur 12',10)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 66: ETC Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'ETC Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'ETC Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Golap Shah Mazar',1),('GPO',2),('Paltan',3),('Press Club',4),('High Court',5),('Matsya Bhaban',6),('Shahbag',7),('Bangla Motor',8),('Kawran Bazar',9),('Farmgate',10),('Khamar Bari',11),('Agargaon',12),('Taltola',13),('Shewra',14),('Kazipara',15),('Mirpur 10',16),('Mirpur 11',17),('Purobi',18),('Pallabi',19),('Mirpur 12',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 67: Everest Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Everest Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Everest Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 2',1),('Mirpur 1',2),('Khamar Bari',3),('Farmgate',4),('Gulistan',5),('Keraniganj',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 68: Falgun Art Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Falgun Art Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Falgun Art Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Azimpur',1),('Nilkhet',2),('New Market',3),('Science Lab',4),('Bata Signal',5),('Katabon',6),('Shahbag',7),('Kakrail',8),('Shantinagar',9),('Malibagh Moor',10),('Mouchak',11),('Malibagh Railgate',12),('Rampura Bazar',13),('Rampura Bridge',14),('Merul',15),('Madhya Badda',16),('Badda',17),('Shahjadpur',18),('Notun Bazar',19),('Nadda',20),('Bashundhara',21),('Jamuna Future Park',22),('Kuril Bishwa Road',23),('Khilkhet',24),('Airport',25),('Rajlakshmi',26),('House Building',27)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 69: First Ten Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'First Ten Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'First Ten Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Vashantek',1),('Mirpur 14',2),('Mirpur 10',3),('Mirpur 2',4),('Sony Cinema Hall',5),('Mirpur 1',6),('Ansar Camp',7),('Technical',8),('Gabtoli',9)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 70: FTCL Bus 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'FTCL Bus 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'FTCL Bus 1') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Jigatola',3),('City College',4),('Science Lab',5),('Bata Signal',6),('Shahbag',7),('Matsya Bhaban',8),('High Court',9),('Press Club',10),('Paltan',11),('GPO',12),('Gulistan',13),('Sayedabad',14),('Jatrabari',15),('Shonir Akhra',16),('Rayerbag',17),('Matuail',18),('Sign Board',19),('Chittagong Road',20)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 71: FTCL Bus 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'FTCL Bus 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'FTCL Bus 2') LIMIT 1), l.id, s.o FROM (VALUES ('Mohammadpur',1),('Shankar',2),('Dhanmondi 15',3),('Jigatola',4),('City College',5),('Science Lab',6),('Shahbag',7),('Matsya Bhaban',8),('Paltan',9),('Gulistan',10),('Motijheel',11),('Arambagh',12)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 72: Gazipur Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Gazipur Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Gazipur Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Paltan',2),('Kakrail',3),('Shantinagar',4),('Malibagh Moor',5),('Mouchak',6),('Mogbazar',7),('Nabisco',8),('Mohakhali',9),('Chairman Bari',10),('Sainik Club',11),('Kakali',12),('Banani',13),('Staff Road',14),('MES',15),('Shewra',16),('Kuril Bishwa Road',17),('Khilkhet',18),('Airport',19),('Jashimuddin',20),('Rajlakshmi',21),('Azampur',22),('House Building',23),('Abdullahpur',24),('Tongi',25),('Station Road',26),('Mill Gate',27),('Board Bazar',28),('Gazipur Chourasta',29)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 73: Grameen Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Grameen Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Grameen Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Ansar Camp',6),('Technical',7),('Gabtoli',8)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 74: Grameen Suveccha
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Grameen Suveccha'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Grameen Suveccha') LIMIT 1), l.id, s.o FROM (VALUES ('Fulbaria',1),('Chankhar Pul',2),('Bakshi Bazar',3),('Azimpur',4),('Nilkhet',5),('New Market',6),('City College',7),('Kalabagan',8),('Dhanmondi 32',9),('Dhanmondi 27',10),('Asad Gate',11),('College Gate',12),('Shishu Mela',13),('Shyamoli',14),('Kallyanpur',15),('Darussalam',16),('Technical',17),('Gabtoli',18),('Amin Bazar',19),('Hemayetpur',20),('Savar',21),('Baipayl',22),('Zirani Bazar',23),('Nandan Park',24),('Chandra',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 75: Green Anabil
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Green Anabil'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Green Anabil') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Matuail',2),('Rayerbag',3),('Shonir Akhra',4),('Jatrabari',5),('Sayedabad',6),('Mugdapara',7),('Bashabo',8),('Khilgaon',9),('Malibagh Railgate',10),('Hazipara',11),('Rampura Bazar',12),('Rampura Bridge',13),('Merul',14),('Badda',15),('Uttar Badda',16),('Shahjadpur',17),('Bashtola',18),('Notun Bazar',19),('Nadda',20),('Bashundhara',21),('Jamuna Future Park',22),('Kuril Bishwa Road',23),('Khilkhet',24),('Airport',25),('Jashimuddin',26),('Rajlakshmi',27),('Azampur',28),('House Building',29),('Abdullahpur',30),('Tongi',31),('Station Road',32),('Mill Gate',33),('Board Bazar',34),('Gazipur Bypass',35),('Gazipur Chourasta',36)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 76: Green Dhaka
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Green Dhaka'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Green Dhaka') LIMIT 1), l.id, s.o FROM (VALUES ('Motijheel',1),('Gulistan',2),('GPO',3),('Paltan',4),('Kakrail',5),('Shantinagar',6),('Malibagh Moor',7),('Mouchak',8),('Malibagh Railgate',9),('Hazipara',10),('Rampura Bazar',11),('Rampura Bridge',12),('Merul',13),('Badda',14),('Uttar Badda',15),('Shahjadpur',16),('Bashtola',17),('Notun Bazar',18),('Nadda',19),('Bashundhara',20),('Jamuna Future Park',21),('Kuril Bishwa Road',22),('Khilkhet',23),('Airport',24),('Jashimuddin',25),('Rajlakshmi',26),('Azampur',27),('House Building',28),('Abdullahpur',29)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 77: Gulshan Chaka
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Gulshan Chaka'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Gulshan Chaka') LIMIT 1), l.id, s.o FROM (VALUES ('Banani',1),('Gulshan 2',2),('Notun Bazar',3)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 78: Hazi Transport
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Hazi Transport'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Hazi Transport') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 12',1),('Pallabi',2),('Purobi',3),('Mirpur 10',4),('Kazipara',5),('Shewra',6),('Agargaon',7),('Bijoy Sarani',8),('Farmgate',9),('Kawran Bazar',10),('Bangla Motor',11),('Shahbag',12),('Matsya Bhaban',13),('High Court',14),('Press Club',15),('Paltan',16),('GPO',17),('Gulistan',18),('Motijheel',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 79: Himachal Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Himachal Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Himachal Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Sony Cinema Hall',1),('Mirpur 10',2),('Kazipara',3),('Shewra',4),('Mohakhali',5),('Gulshan 1',6),('Badda',7),('Rampura Bridge',8),('Rampura Bazar',9),('Khilgaon',10)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 80: Himachal Suveccha
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Himachal Suveccha'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Himachal Suveccha') LIMIT 1), l.id, s.o FROM (VALUES ('Sign Board',1),('Matuail',2),('Rayerbag',3),('Shonir Akhra',4),('Jatrabari',5),('Gulistan',6),('GPO',7),('Paltan',8),('Press Club',9),('High Court',10),('Matsya Bhaban',11),('Shahbag',12),('Bangla Motor',13),('Kawran Bazar',14),('Farmgate',15),('Bijoy Sarani',16),('Agargaon',17),('Taltola',18),('Shewra',19),('Kazipara',20),('Mirpur 10',21),('Mirpur 11',22),('Purobi',23),('Pallabi',24),('Mirpur 12',25)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 81: Himalay Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Himalay Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Himalay Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Madanpur',1),('Jatrabari',2),('Bangladesh Bank',3),('Mogbazar',4),('Mohakhali',5),('Tongi',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 82: Itihash Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Itihash Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Itihash Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 14',1),('Mirpur 10',2),('Mirpur 2',3),('Sony Cinema Hall',4),('Mirpur 1',5),('Ansar Camp',6),('Technical',7),('Gabtoli',8),('Amin Bazar',9),('Hemayetpur',10),('Savar',11),('Nobinagar',12),('Baipayl',13),('Zirani Bazar',14),('Nandan Park',15),('Chandra',16)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 83: J M Super Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'J M Super Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'J M Super Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Jatrabari',1),('Sayedabad',2),('Mugdapara',3),('Bashabo',4),('Khilgaon',5),('Malibagh Railgate',6),('Hazipara',7),('Rampura Bazar',8),('Rampura Bridge',9),('Merul',10),('Badda',11),('Uttar Badda',12),('Shahjadpur',13),('Bashtola',14),('Notun Bazar',15),('Nadda',16),('Bashundhara',17),('Jamuna Future Park',18),('Kuril Bishwa Road',19),('Khilkhet',20),('Airport',21),('Jashimuddin',22),('Rajlakshmi',23),('Azampur',24),('House Building',25),('Abdullahpur',26),('Tongi',27)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 84: Jabale Noor Paribahan 1
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Jabale Noor Paribahan 1'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Jabale Noor Paribahan 1') LIMIT 1), l.id, s.o FROM (VALUES ('Agargaon',1),('Taltola',2),('Shewra',3),('Kazipara',4),('Mirpur 10',5),('Mirpur 11',6),('Purobi',7),('Pallabi',8),('Kalshi',9),('Kuril Bishwa Road',10),('Airport',11),('Jashimuddin',12),('Rajlakshmi',13),('House Building',14),('Abdullahpur',15)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 85: Jabale Noor Paribahan 2
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Jabale Noor Paribahan 2'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Jabale Noor Paribahan 2') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Mirpur 1',2),('Mirpur 10',3),('Kalshi',4),('Kuril Bishwa Road',5),('Notun Bazar',6)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 86: Janjabil Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Janjabil Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Janjabil Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Gabtoli',1),('Hazaribagh',2),('Kamrangirchar',3),('Babubazar',4)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 87: Kamal Plus Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Kamal Plus Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Kamal Plus Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Chittagong Road',1),('Sign Board',2),('Matuail',3),('Rayerbag',4),('Shonir Akhra',5),('Jatrabari',6),('Sayedabad',7),('Gulistan',8),('Chankhar Pul',9),('Bakshi Bazar',10),('Azimpur',11),('Nilkhet',12),('New Market',13),('Science Lab',14),('City College',15),('Jigatola',16),('Dhanmondi 15',17),('Shankar',18),('Mohammadpur',19)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 88: Kanak Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Kanak Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Kanak Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Mirpur 1',1),('Sony Cinema Hall',2),('Mirpur 2',3),('Mirpur 10',4),('Mirpur 11',5),('Purobi',6),('Kalshi',7),('ECB Square',8),('MES',9),('Shewra',10),('Kuril Bishwa Road',11),('Khilkhet',12),('Airport',13),('Jashimuddin',14),('Rajlakshmi',15),('Azampur',16),('House Building',17),('Abdullahpur',18)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 89: Khajababa Bus
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Khajababa Bus'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Khajababa Bus') LIMIT 1), l.id, s.o FROM (VALUES ('Jatrabari',1),('Sayedabad',2),('Gulistan',3),('GPO',4),('Paltan',5),('Press Club',6),('High Court',7),('Matsya Bhaban',8),('Shahbag',9),('Bangla Motor',10),('Kawran Bazar',11),('Farmgate',12),('Khamar Bari',13),('Agargaon',14),('Taltola',15),('Shewra',16),('Kazipara',17),('Mirpur 10',18),('Mirpur 11',19),('Purobi',20),('Pallabi',21),('Mirpur 12',22)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- Bus 90: Kironmala Paribahan
INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = 'Kironmala Paribahan'), 'both');
INSERT INTO route_stops (route_id, location_id, stop_order) SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = 'Kironmala Paribahan') LIMIT 1), l.id, s.o FROM (VALUES ('Chiriyakhana',1),('Mirpur 1',2),('Sony Cinema Hall',3),('Rupnagar',4),('Birulia',5),('Ashulia',6),('Zirabo',7),('Konabari',8)) AS s(n,o) JOIN locations l ON l.name_en = s.n;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Total Buses:' as metric, COUNT(*) as value FROM buses;
SELECT 'Total Routes:' as metric, COUNT(*) as value FROM bus_routes;
SELECT 'Total Route Stops:' as metric, COUNT(*) as value FROM route_stops;
SELECT 'Total Locations:' as metric, COUNT(*) as value FROM locations;
