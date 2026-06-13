/* ============================================================
   EduCMS - Seed Data & Local Storage Utilities
   Provides initial data and CRUD helpers for localStorage
   ============================================================ */

'use strict';

/* ---------- Storage Keys ---------- */
const STORAGE_KEYS = {
  COURSES: 'educms_courses',
  FACULTY: 'educms_faculty',
  ANNOUNCEMENTS: 'educms_announcements',
  REGISTRATIONS: 'educms_registrations',
  INITIALIZED: 'educms_initialized'
};

/* ---------- Seed Data: Courses ---------- */
const SEED_COURSES = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    category: 'Technology',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and databases to build complete web applications from scratch.',
    instructor: 'Dr. Sarah Mitchell',
    duration: '16 Weeks',
    students: 1245,
    rating: 4.9,
    price: 299,
    level: 'Intermediate',
    status: 'active',
    badge: 'popular',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    category: 'Technology',
    description: 'Learn Python, statistics, machine learning algorithms, and data visualization to become a data scientist.',
    instructor: 'Prof. James Anderson',
    duration: '20 Weeks',
    students: 980,
    rating: 4.8,
    price: 349,
    level: 'Advanced',
    status: 'active',
    badge: 'popular',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    category: 'Business',
    description: 'Comprehensive course covering SEO, social media marketing, Google Ads, email campaigns, and analytics.',
    instructor: 'Emily Carter',
    duration: '12 Weeks',
    students: 756,
    rating: 4.7,
    price: 199,
    level: 'Beginner',
    status: 'active',
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    description: 'Learn user research, wireframing, prototyping, and visual design principles using Figma and Adobe XD.',
    instructor: 'Lisa Park',
    duration: '10 Weeks',
    students: 623,
    rating: 4.8,
    price: 249,
    level: 'Beginner',
    status: 'active',
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'Business Analytics with Excel',
    category: 'Business',
    description: 'Master advanced Excel functions, pivot tables, dashboards, and data analysis for business decision making.',
    instructor: 'Robert Chen',
    duration: '8 Weeks',
    students: 512,
    rating: 4.6,
    price: 149,
    level: 'Beginner',
    status: 'active',
    badge: '',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Mobile App Development with React Native',
    category: 'Technology',
    description: 'Build cross-platform mobile applications for iOS and Android using React Native and JavaScript.',
    instructor: 'Dr. Sarah Mitchell',
    duration: '14 Weeks',
    students: 445,
    rating: 4.7,
    price: 279,
    level: 'Intermediate',
    status: 'active',
    badge: '',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'
  },
  {
    id: 7,
    title: 'Graphic Design for Beginners',
    category: 'Design',
    description: 'Introduction to graphic design principles, color theory, typography, and Adobe Creative Suite basics.',
    instructor: 'Lisa Park',
    duration: '8 Weeks',
    students: 389,
    rating: 4.5,
    price: 0,
    level: 'Beginner',
    status: 'active',
    badge: 'free',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop'
  },
  {
    id: 8,
    title: 'Cybersecurity Essentials',
    category: 'Technology',
    description: 'Understand network security, ethical hacking, cryptography, and security best practices for organizations.',
    instructor: 'Prof. James Anderson',
    duration: '12 Weeks',
    students: 367,
    rating: 4.6,
    price: 229,
    level: 'Intermediate',
    status: 'active',
    badge: '',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop'
  },
  {
    id: 9,
    title: 'Creative Writing Workshop',
    category: 'Arts',
    description: 'Develop your writing skills through fiction, non-fiction, poetry workshops, and storytelling techniques.',
    instructor: 'Margaret Williams',
    duration: '6 Weeks',
    students: 298,
    rating: 4.4,
    price: 99,
    level: 'Beginner',
    status: 'active',
    badge: '',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop'
  }
];

/* ---------- Seed Data: Faculty ---------- */
const SEED_FACULTY = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    designation: 'Head of Technology',
    department: 'Computer Science',
    email: 'sarah.mitchell@educms.edu',
    bio: 'Ph.D. in Computer Science from MIT with 15+ years of industry experience at Google and Microsoft.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    id: 2,
    name: 'Prof. James Anderson',
    designation: 'AI Research Lead',
    department: 'Data Science',
    email: 'james.anderson@educms.edu',
    bio: 'Former AI researcher at DeepMind. Published 50+ papers in machine learning and artificial intelligence.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    id: 3,
    name: 'Emily Carter',
    designation: 'Marketing Director',
    department: 'Business Studies',
    email: 'emily.carter@educms.edu',
    bio: 'Digital marketing strategist with expertise in SEO, content marketing, and brand development.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 4,
    name: 'Lisa Park',
    designation: 'Senior UX Designer',
    department: 'Design',
    email: 'lisa.park@educms.edu',
    bio: 'Award-winning designer with experience at Apple and Airbnb. Passionate about user-centered design.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    id: 5,
    name: 'Robert Chen',
    designation: 'Business Analytics Lead',
    department: 'Business Studies',
    email: 'robert.chen@educms.edu',
    bio: 'CPA and MBA from Wharton. 12 years consulting at McKinsey & Company.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 6,
    name: 'Margaret Williams',
    designation: 'Creative Writing Professor',
    department: 'Arts & Humanities',
    email: 'margaret.williams@educms.edu',
    bio: 'Bestselling author and literary critic. Winner of the National Book Award for Fiction.',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    social: { twitter: '#', linkedin: '#' }
  }
];

/* ---------- Seed Data: Announcements ---------- */
const SEED_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Fall 2026 Registration Now Open',
    content: 'Registration for the Fall 2026 semester is now open. Early bird discounts available until July 15th. Enroll in our new courses including Advanced AI and Cloud Computing.',
    category: 'Registration',
    priority: 'high',
    date: '2026-06-10',
    status: 'published',
    author: 'Admin'
  },
  {
    id: 2,
    title: 'New AI & Machine Learning Lab Inauguration',
    content: 'We are excited to announce the inauguration of our state-of-the-art AI and Machine Learning laboratory equipped with the latest GPU computing hardware and software tools.',
    category: 'Campus',
    priority: 'medium',
    date: '2026-06-08',
    status: 'published',
    author: 'Dr. Sarah Mitchell'
  },
  {
    id: 3,
    title: 'Guest Lecture: Future of Web Technologies',
    content: 'Join us for an exclusive guest lecture by Google\'s VP of Engineering on the future of web technologies and emerging trends in software development.',
    category: 'Events',
    priority: 'medium',
    date: '2026-06-05',
    status: 'published',
    author: 'Admin'
  },
  {
    id: 4,
    title: 'Scholarship Applications for 2026-27',
    content: 'Merit-based and need-based scholarship applications are now being accepted. Visit the financial aid office or apply online through the student portal.',
    category: 'Financial Aid',
    priority: 'high',
    date: '2026-06-01',
    status: 'published',
    author: 'Admin'
  },
  {
    id: 5,
    title: 'Annual Hackathon - Register Your Team',
    content: 'Our annual 48-hour hackathon is scheduled for July 20-22. Form teams of 3-5 members and register before July 10th. Amazing prizes to be won!',
    category: 'Events',
    priority: 'low',
    date: '2026-05-28',
    status: 'draft',
    author: 'Prof. James Anderson'
  }
];

/* ============================================================
   LOCAL STORAGE CRUD UTILITIES
   ============================================================ */

/**
 * Initialize localStorage with seed data if first visit
 */
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SEED_COURSES));
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(SEED_FACULTY));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('[EduCMS] Seed data initialized successfully.');
  }
}

/**
 * Get all items from a storage collection
 * @param {string} key - Storage key from STORAGE_KEYS
 * @returns {Array} Array of items
 */
function getAll(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`[EduCMS] Error reading ${key}:`, e);
    return [];
  }
}

/**
 * Get a single item by ID
 * @param {string} key - Storage key
 * @param {number} id - Item ID
 * @returns {Object|null}
 */
function getById(key, id) {
  const items = getAll(key);
  return items.find(item => item.id === id) || null;
}

/**
 * Add a new item to a collection
 * @param {string} key - Storage key
 * @param {Object} item - New item (id auto-assigned)
 * @returns {Object} The newly created item
 */
function addItem(key, item) {
  const items = getAll(key);
  // Auto-increment ID
  const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
  item.id = maxId + 1;
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
  console.log(`[EduCMS] Added item #${item.id} to ${key}`);
  return item;
}

/**
 * Update an existing item by ID
 * @param {string} key - Storage key
 * @param {number} id - Item ID to update
 * @param {Object} updatedData - Fields to update
 * @returns {Object|null} Updated item or null
 */
function updateItem(key, id, updatedData) {
  const items = getAll(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updatedData, id: id };
  localStorage.setItem(key, JSON.stringify(items));
  console.log(`[EduCMS] Updated item #${id} in ${key}`);
  return items[index];
}

/**
 * Delete an item by ID
 * @param {string} key - Storage key
 * @param {number} id - Item ID to delete
 * @returns {boolean}
 */
function deleteItem(key, id) {
  let items = getAll(key);
  const initialLength = items.length;
  items = items.filter(item => item.id !== id);
  if (items.length < initialLength) {
    localStorage.setItem(key, JSON.stringify(items));
    console.log(`[EduCMS] Deleted item #${id} from ${key}`);
    return true;
  }
  return false;
}

/**
 * Search items by a text field
 * @param {string} key - Storage key
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array}
 */
function searchItems(key, query, fields) {
  const items = getAll(key);
  if (!query || query.trim() === '') return items;
  const lowerQuery = query.toLowerCase().trim();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Get statistics for dashboard
 * @returns {Object} Dashboard stats
 */
function getDashboardStats() {
  const courses = getAll(STORAGE_KEYS.COURSES);
  const faculty = getAll(STORAGE_KEYS.FACULTY);
  const announcements = getAll(STORAGE_KEYS.ANNOUNCEMENTS);
  const registrations = getAll(STORAGE_KEYS.REGISTRATIONS);

  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const activeFaculty = faculty.filter(f => f.status === 'active').length;
  const publishedAnnouncements = announcements.filter(a => a.status === 'published').length;

  return {
    totalCourses: courses.length,
    activeCourses,
    totalFaculty: faculty.length,
    activeFaculty,
    totalAnnouncements: announcements.length,
    publishedAnnouncements,
    totalStudents,
    totalRegistrations: registrations.length
  };
}

/* ---------- Auto-initialize on script load ---------- */
initializeData();
