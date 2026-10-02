#!/usr/bin/env node
/**
 * Dhaka Bus Finder - Route Data Generator
 * This script generates SQL INSERT statements for all 90 buses
 * Run: node generate-routes-sql.js > supabase/all-routes-complete.sql
 */

const buses = [
  {
    name: 'Achim Paribahan',
    stops: ['Gabtoli', 'Technical', 'Ansar Camp', 'Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Jamuna Future Park', 'Bashundhara', 'Nadda', 'Notun Bazar', 'Bashtola', 'Shahjadpur', 'Uttar Badda', 'Madhya Badda', 'Merul', 'Rampura Bridge', 'Banasree', 'Demra Staff Quarter']
  },
  {
    name: 'Active Paribahan Bus',
    stops: ['Shyamoli', 'Technical', 'Ansar Camp', 'Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Agradut Bus',
    stops: ['Savar', 'Hemayetpur', 'Amin Bazar', 'Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'Agargaon', 'Zia Uddyan', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda Link Road', 'Bashtola', 'Shahjadpur', 'Uttar Badda', 'Notun Bazar']
  },
  {
    name: 'Airport Bangabandhu Avenue',
    stops: ['Golap Shah Mazar', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Banani', 'Kakali', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Azmeri Glory Bus',
    stops: ['Sadarghat', 'Ray Saheb Bazar', 'Naya Bazar', 'Golap Shah Mazar', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Nabisco', 'Mohakhali', 'Sainik Club', 'Banani', 'Kakali', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Bypass', 'Konabari', 'Chandra']
  },
  {
    name: 'Ajmi Bus',
    stops: ['Dhamrai', 'Savar', 'Hemayetpur', 'Amin Bazar', 'Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'College Gate', 'Asad Gate', 'Dhanmondi 27', 'Dhanmondi 32', 'Kalabagan', 'City College', 'New Market', 'Nilkhet', 'Azimpur', 'Bakshi Bazar', 'Gulistan', 'Chittagong Road']
  },
  {
    name: 'Akash Bus',
    stops: ['Kadamtali', 'Keraniganj', 'Babubazar', 'Naya Bazar', 'Golap Shah Mazar', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi']
  },
  {
    name: 'Akik Bus',
    stops: ['Ansar Camp', 'Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Jamuna Future Park', 'Bashundhara', 'Nadda', 'Notun Bazar', 'Bashtola', 'Shahjadpur', 'Uttar Badda']
  },
  {
    name: 'Al Makka Bus',
    stops: ['Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Mogbazar', 'Nabisco', 'Mohakhali', 'Chairman Bari', 'Kakali', 'Banani', 'ECB Square', 'Kalshi', 'Purobi', 'Mirpur 10', 'Mirpur 2', 'Mirpur 1']
  },
  {
    name: 'Al Madina Plus One Bus',
    stops: ['Nandan Park', 'Zirani Bazar', 'Baipayl', 'Nobinagar', 'Savar', 'Hemayetpur', 'Amin Bazar', 'Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'College Gate', 'Asad Gate', 'Khamar Bari', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Motijheel', 'Kamalapur']
  },
  {
    name: 'Alif Bus 1',
    stops: ['Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Mazar Road', 'Konabari', 'Rupnagar', 'Beribadh', 'Birulia', 'Ashulia', 'Zirabo', 'Fantasy Kingdom', 'Dhaka EPZ']
  },
  {
    name: 'Alif Bus 2',
    stops: ['Mirpur 1', 'Mirpur 2', 'Mirpur 10', 'Kazipara', 'Shewra', 'Agargaon', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda Link Road', 'Madhya Badda', 'Merul', 'Rampura Bridge', 'Banasree']
  },
  {
    name: 'Alif Bus 3',
    stops: ['Japan Garden City', 'Ring Road', 'Adabor', 'Shyamoli', 'Shishu Mela', 'Agargaon', 'Zia Uddyan', 'Bijoy Sarani', 'Old Airport', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Kakali', 'Banani', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Anabil Super',
    stops: ['Sign Board', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Mugdapara', 'Bashabo', 'Khilgaon', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Bypass', 'Gazipur Chourasta']
  },
  {
    name: 'Arnob Bus',
    stops: ['Hemayetpur', 'Amin Bazar', 'Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'Agargaon', 'Zia Uddyan', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda Link Road', 'Madhya Badda', 'Merul', 'Rampura Bridge', 'Banasree', 'Demra Staff Quarter']
  },
  {
    name: 'Ashirbad Pahibahan',
    stops: ['Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 32', 'Dhanmondi 27', 'Shukrabad', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Kallyanpur', 'Shyamoli', 'Technical', 'Ansar Camp', 'Mirpur 1', 'Mirpur 2', 'Proshika Moor', 'Shiyal Bari', 'Rupnagar Abashik', 'Duaripara']
  },
  {
    name: 'Ashulia Classic',
    stops: ['Nobinagar', 'Baipayl', 'Jamgora', 'Fantasy Kingdom', 'Zirabo', 'Ashulia Bazar', 'Kamarpara', 'Abdullahpur', 'House Building', 'Azampur', 'Rajlakshmi', 'Jashimuddin', 'Airport', 'Khilkhet', 'Kuril Bishwa Road', 'Shewra', 'MES', 'Kakali', 'Banani', 'Chairman Bari', 'Mohakhali', 'Nabisco', 'Satrasta']
  },
  {
    name: 'Asmani Bus',
    stops: ['Dhour', 'Abdullahpur', 'House Building', 'Azampur', 'Rajlakshmi', 'Jashimuddin', 'Airport', 'Khilkhet', 'Kuril Bishwa Road', 'Jamuna Future Park', 'Bashundhara', 'Nadda', 'Notun Bazar', 'Bashtola', 'Shahjadpur', 'Uttar Badda', 'Badda', 'Madhya Badda', 'Merul', 'Rampura Bridge', 'Banasree', 'Demra Staff Quarter', 'Tarabo', 'Madanpur']
  },
  {
    name: 'ATCL Bus',
    stops: ['Mohammadpur Bus Stand', 'Asad Gate', 'Shukrabad', 'Kalabagan', 'City College', 'Science Lab', 'Bata Signal', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Arambagh']
  },
  {
    name: 'Ayat Bus',
    stops: ['Chiriyakhana', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Kazipara', 'Shewra', 'Taltola', 'Agargaon', 'Khamar Bari', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Mogbazar', 'Mouchak', 'Malibagh Moor', 'Rajarbag', 'Kamalapur']
  },
  {
    name: 'Bahon Bus',
    stops: ['Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Mirpur 1', 'Ansar Camp', 'Bangla College', 'Technical', 'Darussalam', 'Kallyanpur', 'Shyamoli', 'Asad Gate', 'Dhanmondi 27', 'Dhanmondi 32', 'Kalabagan', 'Science Lab', 'Katabon', 'Shahbag', 'High Court', 'Press Club', 'Paltan', 'Dainik Bangla Moor', 'Motijheel', 'Arambagh', 'Kamalapur', 'Mugdapara', 'Bashabo', 'Khilgaon']
  },
  {
    name: 'Baishakhi Bus',
    stops: ['Savar', 'Hemayetpur', 'Amin Bazar', 'Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'Agargaon', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Gulshan 1', 'Badda Link Road', 'Bashtola', 'Uttar Badda', 'Notun Bazar']
  },
  {
    name: 'Balaka Bus',
    stops: ['Sayedabad', 'Kamalapur', 'Malibagh Moor', 'Mouchak', 'Mogbazar', 'Satrasta', 'Nabisco', 'Mohakhali', 'Chairman Bari', 'Banani', 'Kakali', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Bypass', 'Gazipur Chourasta']
  },
  {
    name: 'Basumati',
    stops: ['Gabtoli', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'College Gate', 'Asad Gate', 'Manik Mia Avenue', 'Khamar Bari', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Golap Shah Mazar', 'Naya Bazar', 'Babubazar', 'Keraniganj', 'Maowa']
  },
  {
    name: 'Basumati Transport',
    stops: ['Gabtoli', 'Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Chourasta']
  },
  {
    name: 'Best Satabdi',
    stops: ['Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 32', 'Dhanmondi 27', 'Khamar Bari', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Banani', 'Kakali', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Diabari']
  },
  {
    name: 'Best Transport',
    stops: ['Mirpur 10', 'Kazipara', 'Shewra', 'Taltola', 'Agargaon', 'Khamar Bari', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Motijheel', 'Ittefaq Moor', 'Sayedabad', 'Jatrabari']
  },
  {
    name: 'Bhuiyan Paribahan',
    stops: ['Japan Garden City', 'Ring Road', 'Adabor', 'Shyamoli', 'Shishu Mela', 'Agargaon', 'Zia Uddyan', 'Bijoy Sarani', 'Old Airport', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Kakali', 'Banani', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Bihanga Bus',
    stops: ['Mirpur 12', 'Mirpur 11', 'Mirpur 10', 'Kazipara', 'Shewra', 'Agargaon', 'Bijoy Sarani', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan Bridge', 'Gulshan 1', 'Badda', 'Notun Bazar']
  },
  {
    name: 'Bikalpa Auto Service',
    stops: ['Mirpur 12', 'Pallabi', 'Purobi', 'Mirpur 11', 'Mirpur 1', 'Kazipara', 'Shewra', 'Taltola', 'Agargaon', 'Bijoy Sarani', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Motijheel']
  },
  {
    name: 'Bikalpa City Super Service',
    stops: ['Mirpur 12', 'Pallabi', 'Purobi', 'Mirpur 11', 'Mirpur 10', 'Kazipara', 'Shewra', 'Taltola', 'Agargaon', 'Shyamoli', 'Shishu Mela', 'College Gate', 'Asad Gate', 'Dhanmondi 27', 'Dhanmondi 32', 'Kalabagan', 'City College', 'New Market', 'Nilkhet', 'Azimpur']
  },
  {
    name: 'Bikash Bus',
    stops: ['Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 27', 'Dhanmondi 32', 'Khamar Bari', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Sainik Club', 'Banani', 'Kakali', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Abdullahpur', 'Kamarpara']
  },
  {
    name: 'Bikash Paribahan',
    stops: ['Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Gulistan', 'Chankhar Pul', 'Bakshi Bazar', 'Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 32', 'Dhanmondi 27', 'Khamar Bari', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Banani', 'Kakali', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Kamarpara']
  },
  {
    name: 'Bondhu Paribahan',
    stops: ['Gulistan', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar']
  },
  {
    name: 'Borak Bus',
    stops: ['Palashi', 'Meghna Ghat']
  },
  {
    name: 'Bashumoti Bus',
    stops: ['Gazipur Chourasta', 'Tongi', 'Airport', 'Khilkhet', 'Kalshi', 'Pallabi', 'Mirpur 11', 'Mirpur 10', 'Mirpur 1', 'Gabtoli']
  },
  {
    name: 'Brihottor Mirpur',
    stops: ['Chiriyakhana', 'Mirpur 1', 'Gabtoli', 'Amin Bazar', 'Savar', 'Nobinagar', 'Chandra']
  },
  {
    name: 'BRTC Bus 1',
    stops: ['Madanpur', 'Kanchpur', 'Chittagong Road', 'Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Khamar Bari', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Shyamoli', 'Kallyanpur', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Savar']
  },
  {
    name: 'BRTC Bus 2',
    stops: ['Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Chairman Bari', 'Kakali', 'Banani', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi']
  },
  {
    name: 'BRTC Bus 3',
    stops: ['Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Khamar Bari', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Shyamoli', 'Kallyanpur', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Baipayl', 'Zirani Bazar', 'Chandra']
  },
  {
    name: 'BRTC Bus 4',
    stops: ['Mohammadpur', 'Asad Gate', 'Khamar Bari', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda Link Road', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road']
  },
  {
    name: 'BRTC Bus 5',
    stops: ['Kamalapur', 'Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda Link Road', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road']
  },
  {
    name: 'BRTC Bus 6',
    stops: ['Vulta', 'Kanchan Bridge', 'Nila Market', '300 Feet', 'Bashundhara 300 Feet Gate', 'Kuril Bishwa Road']
  },
  {
    name: 'BRTC Bus 7',
    stops: ['Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'BRTC Bus 8',
    stops: ['Mohammadpur', 'Shankar', 'Star Kabab', 'Dhanmondi 15', 'Jigatola', 'City College', 'Science Lab', 'Bata Signal', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Motijheel']
  },
  {
    name: 'BRTC Bus 9',
    stops: ['Gabtoli', 'Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Mill Gate', 'Board Bazar', 'Gazipur Bypass', 'Gazipur Chourasta']
  },
  {
    name: 'BRTC Articulated Bus',
    stops: ['Balughat', 'Cantonment', 'Bijoy Sarani', 'Farmgate', 'Bangla Motor', 'Shahbag', 'Paltan', 'Gulistan', 'Motijheel']
  },
  {
    name: 'Cantonment Bus',
    stops: ['Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Savar']
  },
  {
    name: 'Cantonment Mini Service',
    stops: ['Mirpur 14', 'Kachukhet', 'Sainik Club', 'Kakali', 'Banani', 'Mohakhali']
  },
  {
    name: 'Champion Bus',
    stops: ['Vashantek', 'Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Gabtoli']
  },
  {
    name: 'City Link Bus',
    stops: ['Chittagong Road', 'Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bata Signal', 'Science Lab', 'City College', 'Jigatola', 'Dhanmondi 15', 'Star Kabab', 'Shankar', 'Mohammadpur', 'Bosila', 'Ghatar Char']
  },
  {
    name: 'D Link Bus',
    stops: ['Fulbaria', 'Chankhar Pul', 'Bakshi Bazar', 'Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 32', 'Dhanmondi 27', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Shyamoli', 'Kallyanpur', 'Darussalam', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Savar', 'Dhamrai']
  },
  {
    name: 'D One Transport Bus',
    stops: ['Motijheel', 'Dainik Bangla Moor', 'Paltan', 'Press Club', 'Matsya Bhaban', 'High Court', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Shyamoli', 'Kallyanpur', 'Technical', 'Gabtoli', 'Amin Bazar', 'Nobinagar', 'Dhamrai', 'Kalampur']
  },
  {
    name: 'Deepan Bus',
    stops: ['Tajmahal Road', 'Shankar', 'Dhanmondi 15', 'Jigatola', 'City College', 'Science Lab', 'Shahbag', 'Matsya Bhaban', 'Paltan', 'Gulistan', 'Motijheel', 'Arambagh']
  },
  {
    name: 'Desh Bangla Bus',
    stops: ['Postagola', 'Dholairpar', 'Jatrabari', 'Sayedabad', 'Mugdapara', 'Bashabo', 'Khilgaon', 'Malibagh', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Uttar Badda', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Kamarpara']
  },
  {
    name: 'Dewan Bus',
    stops: ['Azimpur', 'Nilkhet', 'New Market', 'Science Lab', 'City College', 'Katabon', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Jahangir Gate', 'Mohakhali', 'Wireless', 'Gulshan 1', 'Badda', 'Badda Link Road', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road']
  },
  {
    name: 'Dhakar Chaka Bus 1',
    stops: ['Police Plaza', 'Gulshan 1', 'Gulshan 2']
  },
  {
    name: 'Dhakar Chaka Bus 2',
    stops: ['Banani', 'Gulshan 2', 'Notun Bazar']
  },
  {
    name: 'Dhaka Metro Service',
    stops: ['Mirpur 1', 'Kallyanpur', 'Shyamoli', 'Asad Gate', 'Shukrabad', 'Kalabagan', 'Science Lab', 'New Market', 'Nilkhet', 'Azimpur']
  },
  {
    name: 'Dhaka Paribahan',
    stops: ['Gulistan', 'Shahbag', 'Farmgate', 'Banani', 'Uttara', 'Gazipur', 'Shib Bari']
  },
  {
    name: 'Dipon',
    stops: ['Tajmahal Road', 'Salimullah Road', 'Jakir Hossen Road', 'Shankar', 'Star Kabab', 'Dhanmondi 15', 'Jigatola', 'City College', 'Science Lab', 'Bata Signal', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'Baitul Mukarram', 'Gulistan', 'Motijheel', 'Arambagh']
  },
  {
    name: 'Dip Paribahan',
    stops: ['Azimpur', 'City College', 'Kalabagan', 'Panthopoth', 'Kawran Bazar', 'Nabisco', 'Gulshan Link Road', 'Gulshan 1', 'Kuril Bishwa Road']
  },
  {
    name: 'Dishari Bus',
    stops: ['Chiriyakhana', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Kallyanpur', 'Shyamoli', 'Shishu Mela', 'College Gate', 'Asad Gate', 'Khamar Bari', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Golap Shah Mazar', 'Naya Bazar', 'Babubazar', 'Keraniganj']
  },
  {
    name: 'Elite Bus',
    stops: ['Agargaon', 'Taltola', 'Shewra', 'Kazipara', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Pallabi', 'Kalshi', 'Kuril Bishwa Road', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'House Building', 'Abdullahpur']
  },
  {
    name: 'ETC Bus',
    stops: ['Golap Shah Mazar', 'Shahbag', 'Bangla Motor', 'Farmgate', 'Agargaon', 'Shewra', 'Kazipara', 'Mirpur 10', 'Pallabi', 'Mirpur 12']
  },
  {
    name: 'ETC Transport',
    stops: ['Golap Shah Mazar', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Khamar Bari', 'Agargaon', 'Taltola', 'Shewra', 'Kazipara', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Pallabi', 'Mirpur 12']
  },
  {
    name: 'Everest Paribahan',
    stops: ['Rupnagar Abashik', 'Mirpur 2', 'Mirpur 1', 'Khamar Bari', 'Farmgate', 'Gulistan', 'Keraniganj']
  },
  {
    name: 'Falgun Art Transport',
    stops: ['Azimpur', 'Nilkhet', 'New Market', 'Science Lab', 'Bata Signal', 'Katabon', 'Shahbag', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Malibagh Railgate', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Madhya Badda', 'Badda', 'Shahjadpur', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Rajlakshmi', 'House Building']
  },
  {
    name: 'First Ten Bus',
    stops: ['Vashantek', 'Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Gabtoli']
  },
  {
    name: 'FTCL Bus 1',
    stops: ['Mohammadpur', 'Shankar', 'Star Kabab', 'Jigatola', 'City College', 'Science Lab', 'Bata Signal', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Sayedabad', 'Janapath Moor', 'Jatrabari', 'Shonir Akhra', 'Rayerbag', 'Matuail', 'Sign Board', 'Chittagong Road']
  },
  {
    name: 'FTCL Bus 2',
    stops: ['Mohammadpur', 'Shankar', 'Dhanmondi 15', 'Jigatola', 'City College', 'Science Lab', 'Shahbag', 'Matsya Bhaban', 'Paltan', 'Gulistan', 'Motijheel', 'Arambagh']
  },
  {
    name: 'Gazipur Paribahan',
    stops: ['Motijheel', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Mogbazar', 'Nabisco', 'Mohakhali', 'Chairman Bari', 'Sainik Club', 'Kakali', 'Banani', 'Staff Road', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Chourasta', 'Shib Bari']
  },
  {
    name: 'Grameen Bus',
    stops: ['Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Gabtoli']
  },
  {
    name: 'Grameen Suveccha',
    stops: ['Fulbaria', 'Chankhar Pul', 'Bakshi Bazar', 'Azimpur', 'Nilkhet', 'New Market', 'City College', 'Kalabagan', 'Dhanmondi 32', 'Dhanmondi 27', 'Asad Gate', 'College Gate', 'Shishu Mela', 'Shyamoli', 'Kallyanpur', 'Darussalam', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Savar', 'Baipayl', 'Zirani Bazar', 'Nandan Park', 'Chandra']
  },
  {
    name: 'Green Anabil',
    stops: ['Chashara', 'Shibu Market', 'Jalkuri', 'Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Mugdapara', 'Bashabo', 'Khilgaon', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi', 'Station Road', 'Mill Gate', 'Board Bazar', 'Gazipur Bypass', 'Gazipur Chourasta']
  },
  {
    name: 'Green Dhaka',
    stops: ['Motijheel', 'Gulistan', 'GPO', 'Paltan', 'Kakrail', 'Shantinagar', 'Malibagh Moor', 'Mouchak', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Gulshan Chaka',
    stops: ['Banani', 'Gulshan 2', 'Notun Bazar']
  },
  {
    name: 'Hazi Transport',
    stops: ['Mirpur 12', 'Pallabi', 'Purobi', 'Mirpur 10', 'Kazipara', 'Shewra', 'Agargaon', 'Bijoy Sarani', 'Farmgate', 'Kawran Bazar', 'Bangla Motor', 'Shahbag', 'Matsya Bhaban', 'High Court', 'Press Club', 'Paltan', 'GPO', 'Gulistan', 'Motijheel']
  },
  {
    name: 'Himachal Bus',
    stops: ['Sony Cinema Hall', 'Mirpur 10', 'Kazipara', 'Shewra', 'Mohakhali', 'Gulshan 1', 'Badda', 'Rampura Bridge', 'Rampura Bazar', 'Khilgaon']
  },
  {
    name: 'Himachal Suveccha',
    stops: ['Chashara', 'Shibu Market', 'Jalkuri', 'Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Janapath Moor', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Bijoy Sarani', 'Agargaon', 'Taltola', 'Shewra', 'Kazipara', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Pallabi', 'Mirpur 12']
  },
  {
    name: 'Himalay Bus',
    stops: ['Madanpur', 'Jatrabari', 'Bangladesh Bank', 'Mogbazar', 'Mohakhali', 'Tongi']
  },
  {
    name: 'Itihash Bus',
    stops: ['Mirpur 14', 'Mirpur 10', 'Mirpur 2', 'Sony Cinema Hall', 'Mirpur 1', 'Ansar Camp', 'Technical', 'Gabtoli', 'Amin Bazar', 'Hemayetpur', 'Savar', 'Nobinagar', 'Baipayl', 'Zirani Bazar', 'Nandan Park', 'Chandra']
  },
  {
    name: 'J M Super Paribahan',
    stops: ['Jatrabari', 'Sayedabad', 'Mugdapara', 'Bashabo', 'Khilgaon', 'Malibagh Railgate', 'Hazipara', 'Rampura Bazar', 'Rampura Bridge', 'Merul', 'Badda', 'Uttar Badda', 'Shahjadpur', 'Bashtola', 'Notun Bazar', 'Nadda', 'Bashundhara', 'Jamuna Future Park', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur', 'Tongi']
  },
  {
    name: 'Jabale Noor Paribahan 1',
    stops: ['Agargaon', 'Taltola', 'Shewra', 'Kazipara', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Pallabi', 'Kalshi', 'Kuril Bishwa Road', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Jabale Noor Paribahan 2',
    stops: ['Gabtoli', 'Mirpur 1', 'Mirpur 10', 'Kalshi', 'Kuril Bishwa Road', 'Notun Bazar']
  },
  {
    name: 'Janjabil Bus',
    stops: ['Gabtoli', 'Beribadh', 'Rayer Bazar', 'Sikder Medical College', 'Hazaribagh', 'Nawabganj', 'Kamrangirchar', 'Showari Ghat', 'Mitford Ghat', 'Babubazar']
  },
  {
    name: 'Kamal Plus Paribahan',
    stops: ['Chittagong Road', 'Sign Board', 'Matuail', 'Rayerbag', 'Shonir Akhra', 'Jatrabari', 'Sayedabad', 'Gulistan', 'Chankhar Pul', 'Bakshi Bazar', 'Azimpur', 'Nilkhet', 'New Market', 'Science Lab', 'City College', 'Jigatola', 'Dhanmondi 15', 'Star Kabab', 'Shankar', 'Mohammadpur', 'Ghatar Char']
  },
  {
    name: 'Kanak Bus',
    stops: ['Mirpur 1', 'Sony Cinema Hall', 'Mirpur 2', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Kalshi', 'ECB Square', 'MES', 'Shewra', 'Kuril Bishwa Road', 'Khilkhet', 'Airport', 'Jashimuddin', 'Rajlakshmi', 'Azampur', 'House Building', 'Abdullahpur']
  },
  {
    name: 'Khajababa Bus',
    stops: ['Jatrabari', 'Sayedabad', 'Gulistan', 'GPO', 'Paltan', 'Press Club', 'High Court', 'Matsya Bhaban', 'Shahbag', 'Bangla Motor', 'Kawran Bazar', 'Farmgate', 'Khamar Bari', 'Agargaon', 'Taltola', 'Shewra', 'Kazipara', 'Mirpur 10', 'Mirpur 11', 'Purobi', 'Pallabi', 'Mirpur 12']
  },
  {
    name: 'Kironmala Paribahan',
    stops: ['Chiriyakhana', 'Mirpur 1', 'Sony Cinema Hall', 'Rupnagar', 'Birulia', 'Ashulia', 'Zirabo', 'Narshinghapur', 'Sura Bari', 'Kashimpur', 'Jarun', 'Konabari']
  }
];

// Generate SQL
console.log('-- =====================================================');
console.log('-- Dhaka Bus Finder — Complete Routes for All 90 Buses');
console.log('-- =====================================================');
console.log('-- Run AFTER data-import-90-buses.sql');
console.log('-- =====================================================\n');

buses.forEach((bus, index) => {
  console.log(`-- Bus ${index + 1}: ${bus.name}`);
  console.log(`INSERT INTO bus_routes (bus_id, direction) VALUES ((SELECT id FROM buses WHERE name_en = '${bus.name}'), 'both');`);
  console.log('');
  console.log(`INSERT INTO route_stops (route_id, location_id, stop_order)`);
  console.log(`SELECT (SELECT id FROM bus_routes WHERE bus_id = (SELECT id FROM buses WHERE name_en = '${bus.name}') LIMIT 1), l.id, s.stop_order`);
  console.log('FROM (VALUES');
  
  bus.stops.forEach((stop, i) => {
    const comma = i < bus.stops.length - 1 ? ',' : '';
    console.log(`  ('${stop.replace(/'/g, "''")}', ${i + 1})${comma}`);
  });
  
  console.log(`) AS s(name, stop_order)`);
  console.log(`JOIN locations l ON l.name_en = s.name;`);
  console.log('');
});

console.log('-- =====================================================');
console.log('-- VERIFICATION');
console.log('-- =====================================================');
console.log(`SELECT COUNT(*) as total_routes FROM bus_routes;`);
console.log(`SELECT COUNT(*) as total_stops FROM route_stops;`);
