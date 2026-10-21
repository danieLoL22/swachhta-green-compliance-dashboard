require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Location = require('../models/Location');
const Category = require('../models/Category');
const Standard = require('../models/Standard');
const Inspection = require('../models/Inspection');
const Issue = require('../models/Issue');
const { calcScore } = require('./scoreUtils');

const CATS = [
  { name: 'Cleanliness & Sanitation', description: 'Classroom, corridor and toilet hygiene', icon: 'sparkles' },
  { name: 'Waste Management', description: 'Segregation, collection and disposal', icon: 'trash' },
  { name: 'Water Management', description: 'Leakage, drinking water and harvesting', icon: 'droplet' },
  { name: 'Energy Management', description: 'Lighting, equipment and renewables', icon: 'zap' },
  { name: 'Green Environment', description: 'Plantation, gardens and composting', icon: 'leaf' },
];
const STANDARDS = {
  'Cleanliness & Sanitation': ['Classrooms are clean','Corridors and common areas are clean','Toilets are clean and hygienic','Dustbins are available','Waste is removed regularly'],
  'Waste Management': ['Wet and dry waste are segregated','Separate waste bins are available','Waste is collected regularly','Plastic waste is properly controlled','E-waste is properly handled'],
  'Water Management': ['No leaking taps','No leaking pipes','Drinking water facilities are maintained','Water tanks are cleaned regularly','Rainwater harvesting is implemented where applicable'],
  'Energy Management': ['LED/energy-efficient lighting is used','Lights are switched off when not required','Fans and AC units are properly maintained','Energy-efficient equipment is used','Renewable-energy initiatives are present where applicable'],
  'Green Environment': ['Green areas are maintained','Trees are properly maintained','Plantation activities are conducted','Gardens are maintained','Composting/environmental initiatives are present'],
};
const LOCS = [
  { name: 'Block A', type: 'Academic Block' }, { name: 'Block B', type: 'Academic Block' },
  { name: 'Block C', type: 'Academic Block' }, { name: 'Canteen', type: 'Food Court' },
  { name: 'Library', type: 'Facility' }, { name: 'Laboratory', type: 'Lab' },
  { name: 'Auditorium', type: 'Facility' }, { name: 'Sports Area', type: 'Outdoor' },
  { name: 'Hostel', type: 'Residential' },
];
function pick(pattern, i) {
  const m = pattern % 3;
  if (m === 0) return i % 4 === 3 ? 'non_compliant' : (i % 3 === 1 ? 'partial' : 'compliant');
  if (m === 1) return i % 5 === 4 ? 'non_compliant' : (i % 2 === 0 ? 'compliant' : 'partial');
  return i % 6 === 5 ? 'non_compliant' : 'compliant';
}
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected, clearing...');
  await Promise.all([User.deleteMany({}), Location.deleteMany({}), Category.deleteMany({}), Standard.deleteMany({}), Inspection.deleteMany({}), Issue.deleteMany({})]);
  const admin = await User.create({ name: 'Admin User', email: 'admin@swachhta.com', password: 'Admin@123', role: 'admin', department: 'Administration' });
  const inspector = await User.create({ name: 'Ravi Inspector', email: 'inspector@swachhta.com', password: 'Inspector@123', role: 'inspector', department: 'Environment Cell' });
  const inspector2 = await User.create({ name: 'Priya Sharma', email: 'priya@swachhta.com', password: 'Inspector@123', role: 'inspector', department: 'Maintenance' });
  const catDocs = await Category.insertMany(CATS);
  const catByName = {}; catDocs.forEach(c => catByName[c.name] = c);
  const stdDocs = [];
  for (const [cn, titles] of Object.entries(STANDARDS)) {
    for (const t of titles) stdDocs.push(await Standard.create({ title: t, category: catByName[cn]._id }));
  }
  const locDocs = await Location.insertMany(LOCS);
  const stdByCat = {}; stdDocs.forEach(s => { const k = String(s.category); (stdByCat[k] = stdByCat[k] || []).push(s); });
  // Sample inspections: ~18 across locations/categories + 3 repeat failures for recurring violation (Block B toilets)
  const inspections = [];
  let n = 0;
  const combos = [];
  locDocs.forEach((l, li) => { catDocs.forEach((c, ci) => { if ((li + ci) % 2 === 0 && combos.length < 15) combos.push([l, c]); }); });
  const monthsBack = [0, 1, 2, 3, 4, 5];
  for (let i = 0; i < combos.length; i++) {
    const [loc, cat] = combos[i];
    const stds = stdByCat[String(cat._id)];
    const results = stds.map((s, si) => ({ standard: s._id, status: pick(i + si, si + i), remarks: si === 0 ? 'Verified during walkthrough' : '' }));
    const { score, obtained, possible, rating } = calcScore(results);
    const d = new Date(); d.setMonth(d.getMonth() - monthsBack[i % monthsBack.length]); d.setDate(5 + (i % 20));
    inspections.push(await Inspection.create({ location: loc._id, category: cat._id, inspector: (i % 2 ? inspector : inspector2)._id, date: d, notes: 'Routine inspection', results, score, obtained, possible, rating }));
    n++;
  }
  // Recurring violations: Block B + Cleanliness toilets non-compliant x3
  const blockB = locDocs.find(l => l.name === 'Block B');
  const cleanCat = catDocs.find(c => c.name === 'Cleanliness & Sanitation');
  const toiletStd = stdDocs.find(s => s.title === 'Toilets are clean and hygienic');
  const cleanStds = stdByCat[String(cleanCat._id)];
  for (let k = 0; k < 3; k++) {
    const results = cleanStds.map(s => ({ standard: s._id, status: String(s._id) === String(toiletStd._id) ? 'non_compliant' : (k === 1 ? 'partial' : 'compliant'), remarks: String(s._id) === String(toiletStd._id) ? 'Block B Ground Floor Toilet Hygiene poor, foul smell observed' : '' }));
    const { score, obtained, possible, rating } = calcScore(results);
    const d = new Date(); d.setDate(d.getDate() - k * 12);
    inspections.push(await Inspection.create({ location: blockB._id, category: cleanCat._id, inspector: inspector._id, date: d, notes: 'Follow-up inspection Block B', results, score, obtained, possible, rating }));
  }
  // Canteen waste + Hostel water + Library energy problem inspections
  const canteen = locDocs.find(l => l.name === 'Canteen'); const wasteCat = catDocs.find(c => c.name === 'Waste Management');
  const hostel = locDocs.find(l => l.name === 'Hostel'); const waterCat = catDocs.find(c => c.name === 'Water Management');
  const library = locDocs.find(l => l.name === 'Library'); const energyCat = catDocs.find(c => c.name === 'Energy Management');
  async function mkInsp(loc, cat, statuses, note) {
    const stds = stdByCat[String(cat._id)];
    const results = stds.map((s, i) => ({ standard: s._id, status: statuses[i] || 'compliant', remarks: '' }));
    const { score, obtained, possible, rating } = calcScore(results);
    return Inspection.create({ location: loc._id, category: cat._id, inspector: inspector._id, date: new Date(), notes: note, results, score, obtained, possible, rating });
  }
  inspections.push(await mkInsp(canteen, wasteCat, ['non_compliant','non_compliant','partial','compliant','compliant'], 'Canteen Waste Segregation needs attention'));
  inspections.push(await mkInsp(hostel, waterCat, ['non_compliant','compliant','partial','non_compliant','compliant'], 'Hostel Water Leakage observed'));
  inspections.push(await mkInsp(library, energyCat, ['partial','non_compliant','compliant','compliant','partial'], 'Library Energy Efficiency review'));
  // Issues from non-compliant results
  const issueSamples = [
    { t: 'Block B Ground Floor Toilet Hygiene', loc: 'Block B', pr: 'Critical', st: 'Open', due: 3 },
    { t: 'Canteen Waste Segregation', loc: 'Canteen', pr: 'High', st: 'In Progress', due: 7 },
    { t: 'Hostel Water Leakage', loc: 'Hostel', pr: 'High', st: 'Open', due: -2 },
    { t: 'Library Energy Efficiency', loc: 'Library', pr: 'Medium', st: 'Open', due: 10 },
    { t: 'Laboratory E-waste Disposal', loc: 'Laboratory', pr: 'Medium', st: 'Resolved', due: -20 },
    { t: 'Sports Area Litter Clearing', loc: 'Sports Area', pr: 'Low', st: 'Closed', due: -30 },
  ];
  for (const s of issueSamples) {
    const loc = locDocs.find(l => l.name === s.loc);
    const d = new Date(); d.setDate(d.getDate() + s.due);
    const obj = await Issue.create({ title: s.t, description: 'Corrective action required: ' + s.t, location: loc._id, category: cleanCat._id, reportedBy: inspector._id, assignedTo: inspector2._id, priority: s.pr, status: s.st, dueDate: d });
    if (s.st === 'Resolved' || s.st === 'Closed') { obj.resolvedDate = new Date(); obj.resolutionRemarks = 'Action completed and verified.'; await obj.save(); }
  }
  console.log('Seeded: users, ' + catDocs.length + ' cats, ' + stdDocs.length + ' standards, ' + locDocs.length + ' locs, ' + inspections.length + ' inspections');
  console.log('Logins: admin@swachhta.com / Admin@123, inspector@swachhta.com / Inspector@123 - PLEASE CHANGE DEFAULT PASSWORDS');
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
