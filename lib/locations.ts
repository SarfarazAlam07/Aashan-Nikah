// lib/locations.ts

// Bihar Districts (38 Districts)
export const BIHAR_DISTRICTS = [
  { value: "Araria", label: "Araria" },
  { value: "Arwal", label: "Arwal" },
  { value: "Aurangabad", label: "Aurangabad" },
  { value: "Banka", label: "Banka" },
  { value: "Begusarai", label: "Begusarai" },
  { value: "Bhagalpur", label: "Bhagalpur" },
  { value: "Bhojpur", label: "Bhojpur" },
  { value: "Buxar", label: "Buxar" },
  { value: "Darbhanga", label: "Darbhanga" },
  { value: "East Champaran", label: "East Champaran (Motihari)" },
  { value: "Gaya", label: "Gaya" },
  { value: "Gopalganj", label: "Gopalganj" },
  { value: "Jamui", label: "Jamui" },
  { value: "Jehanabad", label: "Jehanabad" },
  { value: "Kaimur", label: "Kaimur (Bhabua)" },
  { value: "Katihar", label: "Katihar" },
  { value: "Khagaria", label: "Khagaria" },
  { value: "Kishanganj", label: "Kishanganj" },
  { value: "Lakhisarai", label: "Lakhisarai" },
  { value: "Madhepura", label: "Madhepura" },
  { value: "Madhubani", label: "Madhubani" },
  { value: "Munger", label: "Munger" },
  { value: "Muzaffarpur", label: "Muzaffarpur" },
  { value: "Nalanda", label: "Nalanda" },
  { value: "Nawada", label: "Nawada" },
  { value: "Patna", label: "Patna" },
  { value: "Purnia", label: "Purnia" },
  { value: "Rohtas", label: "Rohtas (Sasaram)" },
  { value: "Saharsa", label: "Saharsa" },
  { value: "Samastipur", label: "Samastipur" },
  { value: "Saran", label: "Saran (Chhapra)" },
  { value: "Sheikhpura", label: "Sheikhpura" },
  { value: "Sheohar", label: "Sheohar" },
  { value: "Sitamarhi", label: "Sitamarhi" },
  { value: "Siwan", label: "Siwan" },
  { value: "Supaul", label: "Supaul" },
  { value: "Vaishali", label: "Vaishali (Hajipur)" },
  { value: "West Champaran", label: "West Champaran (Bettiah)" }
];

// Major Cities/Towns in Bihar (with district mapping)
export const BIHAR_CITIES = [
  // Patna Division
  { value: "Patna", label: "Patna", district: "Patna" },
  { value: "Danapur", label: "Danapur", district: "Patna" },
  { value: "Phulwari Sharif", label: "Phulwari Sharif", district: "Patna" },
  { value: "Khagaul", label: "Khagaul", district: "Patna" },
  { value: "Maner", label: "Maner", district: "Patna" },
  { value: "Masaurhi", label: "Masaurhi", district: "Patna" },
  { value: "Naubatpur", label: "Naubatpur", district: "Patna" },
  { value: "Paliganj", label: "Paliganj", district: "Patna" },
  
  // Saran Division
  { value: "Chhapra", label: "Chhapra", district: "Saran" },
  { value: "Siwan", label: "Siwan", district: "Siwan" },
  { value: "Gopalganj", label: "Gopalganj", district: "Gopalganj" },
  { value: "Mairwa", label: "Mairwa", district: "Siwan" },
  { value: "Maharajganj", label: "Maharajganj", district: "Siwan" },
  { value: "Darauli", label: "Darauli", district: "Siwan" },
  { value: "Mirganj", label: "Mirganj", district: "Gopalganj" },
  
  // Tirhut Division
  { value: "Muzaffarpur", label: "Muzaffarpur", district: "Muzaffarpur" },
  { value: "Hajipur", label: "Hajipur", district: "Vaishali" },
  { value: "Sitamarhi", label: "Sitamarhi", district: "Sitamarhi" },
  { value: "Sheohar", label: "Sheohar", district: "Sheohar" },
  { value: "Motihari", label: "Motihari", district: "East Champaran" },
  { value: "Bettiah", label: "Bettiah", district: "West Champaran" },
  { value: "Mehsi", label: "Mehsi", district: "East Champaran" },
  { value: "Raxaul", label: "Raxaul", district: "East Champaran" },
  { value: "Bagaha", label: "Bagaha", district: "West Champaran" },
  
  // Darbhanga Division
  { value: "Darbhanga", label: "Darbhanga", district: "Darbhanga" },
  { value: "Samastipur", label: "Samastipur", district: "Samastipur" },
  { value: "Madhubani", label: "Madhubani", district: "Madhubani" },
  { value: "Benipur", label: "Benipur", district: "Darbhanga" },
  { value: "Jhanjharpur", label: "Jhanjharpur", district: "Madhubani" },
  
  // Kosi Division
  { value: "Saharsa", label: "Saharsa", district: "Saharsa" },
  { value: "Madhepura", label: "Madhepura", district: "Madhepura" },
  { value: "Supaul", label: "Supaul", district: "Supaul" },
  { value: "Birpur", label: "Birpur", district: "Supaul" },
  
  // Purnia Division
  { value: "Purnia", label: "Purnia", district: "Purnia" },
  { value: "Katihar", label: "Katihar", district: "Katihar" },
  { value: "Kishanganj", label: "Kishanganj", district: "Kishanganj" },
  { value: "Araria", label: "Araria", district: "Araria" },
  { value: "Forbesganj", label: "Forbesganj", district: "Araria" },
  
  // Bhagalpur Division
  { value: "Bhagalpur", label: "Bhagalpur", district: "Bhagalpur" },
  { value: "Banka", label: "Banka", district: "Banka" },
  { value: "Kahalgaon", label: "Kahalgaon", district: "Bhagalpur" },
  { value: "Naugachia", label: "Naugachia", district: "Bhagalpur" },
  
  // Munger Division
  { value: "Munger", label: "Munger", district: "Munger" },
  { value: "Begusarai", label: "Begusarai", district: "Begusarai" },
  { value: "Khagaria", label: "Khagaria", district: "Khagaria" },
  { value: "Jamui", label: "Jamui", district: "Jamui" },
  { value: "Lakhisarai", label: "Lakhisarai", district: "Lakhisarai" },
  { value: "Sheikhpura", label: "Sheikhpura", district: "Sheikhpura" },
  
  // Magadh Division
  { value: "Gaya", label: "Gaya", district: "Gaya" },
  { value: "Aurangabad", label: "Aurangabad", district: "Aurangabad" },
  { value: "Nawada", label: "Nawada", district: "Nawada" },
  { value: "Jehanabad", label: "Jehanabad", district: "Jehanabad" },
  { value: "Arwal", label: "Arwal", district: "Arwal" },
  { value: "Bodh Gaya", label: "Bodh Gaya", district: "Gaya" },
  { value: "Rafiganj", label: "Rafiganj", district: "Aurangabad" },
  
  // Other Important Towns
  { value: "Buxar", label: "Buxar", district: "Buxar" },
  { value: "Bhabua", label: "Bhabua", district: "Kaimur" },
  { value: "Sasaram", label: "Sasaram", district: "Rohtas" },
  { value: "Dehri", label: "Dehri", district: "Rohtas" },
  { value: "Nalanda", label: "Nalanda", district: "Nalanda" },
  { value: "Bihar Sharif", label: "Bihar Sharif", district: "Nalanda" },
  { value: "Rajgir", label: "Rajgir", district: "Nalanda" }
];

// Nearby Cities (Outside Bihar but close)
export const NEARBY_CITIES = [
  { value: "Varanasi", label: "Varanasi (Uttar Pradesh)" },
  { value: "Gorakhpur", label: "Gorakhpur (Uttar Pradesh)" },
  { value: "Kushinagar", label: "Kushinagar (Uttar Pradesh)" },
  { value: "Deoria", label: "Deoria (Uttar Pradesh)" },
  { value: "Ballia", label: "Ballia (Uttar Pradesh)" },
  { value: "Mau", label: "Mau (Uttar Pradesh)" },
  { value: "Azamgarh", label: "Azamgarh (Uttar Pradesh)" },
  { value: "Jaunpur", label: "Jaunpur (Uttar Pradesh)" },
  { value: "Mirzapur", label: "Mirzapur (Uttar Pradesh)" },
  { value: "Sonbhadra", label: "Sonbhadra (Uttar Pradesh)" },
  { value: "Siliguri", label: "Siliguri (West Bengal)" },
  { value: "Kolkata", label: "Kolkata (West Bengal)" },
  { value: "Ranchi", label: "Ranchi (Jharkhand)" },
  { value: "Jamshedpur", label: "Jamshedpur (Jharkhand)" },
  { value: "Dhanbad", label: "Dhanbad (Jharkhand)" },
  { value: "Bokaro", label: "Bokaro (Jharkhand)" },
  { value: "Hazaribagh", label: "Hazaribagh (Jharkhand)" },
  { value: "Nepalgunj", label: "Nepalgunj (Nepal)" },
  { value: "Birgunj", label: "Birgunj (Nepal)" },
  { value: "Kathmandu", label: "Kathmandu (Nepal)" }
];

// All Cities Combined (for dropdown)
export const ALL_CITIES = [
  ...BIHAR_CITIES,
  ...NEARBY_CITIES
];

// Get cities by district
export function getCitiesByDistrict(district: string) {
  return BIHAR_CITIES.filter(city => city.district === district);
}

// Get district name from value
export function getDistrictLabel(districtValue: string) {
  const district = BIHAR_DISTRICTS.find(d => d.value === districtValue);
  return district?.label || districtValue;
}