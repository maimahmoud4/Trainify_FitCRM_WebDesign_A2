// js/main.js

/**
 * Data Management (LocalStorage)
 */
const STORAGE_KEY = 'fitcrm_clients';

// Helper to get clients
function getClients() {
  const clients = localStorage.getItem(STORAGE_KEY);
  return clients ? JSON.parse(clients) : [];
}

// Helper to save clients
function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// Helper to generate a unique ID
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * PAGE: add-client.html (Handles Add AND Edit)
 */
function initForm() {
  const form = document.getElementById('clientForm');
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');

  // --- Utility function for email format validation ---
  const isValidEmail = (email) => {
    // Basic regex to check for format: local-part@domain.tld
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // ----------------------------------------------------

  // If in Edit mode, repopulate data
  if (editId) {
    const clients = getClients();
    const client = clients.find(c => c.id === editId);
    if (client) {
      document.getElementById('saveBtn').innerHTML = '<span>💾</span> Update Client';
      document.getElementById('fullName').value = client.fullName;
      document.getElementById('age').value = client.age;
      document.getElementById('gender').value = client.gender;
      document.getElementById('email').value = client.email;
      document.getElementById('phone').value = client.phone;
      document.getElementById('goal').value = client.goal;
      document.getElementById('startDate').value = client.startDate;
    }
  }

  document.getElementById('saveBtn').addEventListener('click', () => {
    // --- 1. GATHER DATA ---
    const fullName = document.getElementById('fullName').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;
    const startDate = document.getElementById('startDate').value;

    // --- 2. PERFORM VALIDATION CHECKS ---
    
    // Check 2.1: Required Fields (Name, Email, Gender, Goal, Start Date)
    if (!fullName || !email || !gender || !goal || !startDate) {
      alert("Please fill in all required fields (Name, Email, Gender, Fitness Goal, and Start Date).");
      return;
    }
    
    // Check 2.2: Age Constraints
    if (isNaN(age) || age <= 0 || age > 150) {
      alert("Please enter a valid age (must be a number greater than 0 and less than 150).");
      return;
    }

    // Check 2.3: Email Format
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address format (e.g., user@domain.com).");
      return;
    }
    
    // --- 3. IF VALIDATION PASSES, PROCEED TO SAVE ---
    const newClient = {
      id: editId || generateId(), // Use existing ID if editing
      fullName,
      age: age, // Use the parsed integer age
      gender: gender,
      email: email,
      phone: document.getElementById('phone').value.trim(),
      goal: goal,
      startDate: startDate,
      lastUpdated: new Date().toLocaleDateString()
    };

    let clients = getClients();

    if (editId) {
      // Update existing
      const index = clients.findIndex(c => c.id === editId);
      if (index !== -1) clients[index] = newClient;
    } else {
      // Add new
      clients.push(newClient);
    }

    saveClients(clients);
    window.location.href = 'client-list.html'; // Redirect to list
  });
}

/**
 * PAGE: client-list.html
 */
function initList() {
  const tableBody = document.querySelector('#clientsTable tbody');
  const searchInput = document.getElementById('nameSearch');
  const countSpan = document.getElementById('count');
  
  function renderTable(filterText = '') {
    const clients = getClients();
    tableBody.innerHTML = '';
    
    // Filter logic
    const filtered = clients.filter(c => 
      c.fullName.toLowerCase().includes(filterText.toLowerCase())
    );

    countSpan.textContent = filtered.length;

    filtered.forEach(client => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="client-view.html?id=${client.id}" style="font-weight:600; color:#2E4AA3">${client.fullName}</a></td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.goal}</td>
        <td>${client.startDate}</td>
        <td class="td-actions">
          <button class="action edit" onclick="location.href='add-client.html?id=${client.id}'">✏️</button>
          <button class="action del" data-id="${client.id}">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach Delete Listeners
    document.querySelectorAll('.del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').dataset.id;
        deleteClient(id);
      });
    });
  }

  // Delete Logic
  function deleteClient(id) {
    if (confirm('Are you sure you want to delete this client?')) {
      let clients = getClients();
      clients = clients.filter(c => c.id !== id);
      saveClients(clients);
      renderTable(searchInput.value);
    }
  }

  // Search Listener
  searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
  });

  // Initial Render
  renderTable();
}

/**
 * PAGE: client-view.html (Page 3)
 */
/**
 * EASIEST WORKING SOLUTION
 * Replace your entire initView() function with this
 * Uses allorigins.win - a free, reliable CORS proxy
 */

async function initView() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const client = getClients().find(c => c.id === id);

  if (!client) {
    document.querySelector('.view-content').innerHTML = '<p>Client not found.</p>';
    return;
  }

  // Render Client Info
  document.getElementById('viewName').textContent = client.fullName;
  document.getElementById('viewEmail').textContent = client.email;
  document.getElementById('viewPhone').textContent = client.phone;
  document.getElementById('viewGoal').textContent = client.goal;
  
  // Fetch External API
  const exerciseList = document.getElementById('exerciseList');
  exerciseList.innerHTML = '<li>Loading exercises from Wger API...</li>';

  try {
    // Use allorigins.win proxy - it's free and reliable
    const targetUrl = 'https://wger.de/api/v2/exercise/?language=2&limit=5';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    exerciseList.innerHTML = '';
    
    if (data.results && data.results.length > 0) {
      data.results.forEach(ex => {
        const li = document.createElement('li');
        // Clean HTML tags from description
        const cleanDesc = ex.description 
          ? ex.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..." 
          : "No description available.";
        
        li.innerHTML = `<strong>${ex.name}</strong><br><small>${cleanDesc}</small>`;
        exerciseList.appendChild(li);
      });
      
      // Add success message
      const note = document.createElement('p');
      note.className = 'muted';
      note.style.fontSize = '0.85rem';
      note.style.marginTop = '1rem';
      note.style.color = '#28a745';
      note.textContent = '✓ Successfully fetched 5 exercises from Wger Workout Manager API';
      document.querySelector('.api-section').appendChild(note);
    } else {
      throw new Error('No exercises found');
    }

  } catch (error) {
    console.error("API fetch error:", error);
    
    // Fallback to goal-specific exercises
    const mockExercises = {
      'Weight Loss': [
        { name: 'High-Intensity Interval Training (HIIT)', desc: 'Alternating short bursts of intense exercise with recovery periods for maximum calorie burn.' },
        { name: 'Jump Rope', desc: 'Effective cardio exercise that burns calories quickly and improves coordination.' },
        { name: 'Burpees', desc: 'Full-body exercise combining strength and cardio for efficient fat burning.' },
        { name: 'Mountain Climbers', desc: 'Dynamic core and cardio exercise that elevates heart rate.' },
        { name: 'Cycling', desc: 'Low-impact cardio perfect for sustained calorie burning and endurance.' }
      ],
      'Muscle Gain': [
        { name: 'Barbell Squats', desc: 'Compound exercise targeting quads, hamstrings, and glutes for lower body mass.' },
        { name: 'Bench Press', desc: 'Essential upper body exercise for chest, shoulders, and triceps development.' },
        { name: 'Deadlifts', desc: 'Full-body compound lift building overall strength and muscle mass.' },
        { name: 'Pull-ups', desc: 'Bodyweight exercise for back and bicep development.' },
        { name: 'Overhead Press', desc: 'Shoulder-focused compound movement for upper body strength.' }
      ],
      'General Fitness': [
        { name: 'Push-ups', desc: 'Classic upper body exercise targeting chest, shoulders, and triceps.' },
        { name: 'Squats', desc: 'Fundamental lower body exercise for legs and glutes.' },
        { name: 'Plank', desc: 'Core strengthening exercise building stability and endurance.' },
        { name: 'Lunges', desc: 'Single-leg exercise improving balance and leg strength.' },
        { name: 'Yoga Flow', desc: 'Flexibility and mindfulness practice improving overall wellness.' }
      ]
    };
    
    const exercises = mockExercises[client.goal] || mockExercises['General Fitness'];
    
    exerciseList.innerHTML = '';
    exercises.forEach(ex => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${ex.name}</strong><br><small>${ex.desc}</small>`;
      exerciseList.appendChild(li);
    });
    
    const note = document.createElement('p');
    note.className = 'muted';
    note.style.fontSize = '0.85rem';
    note.style.marginTop = '1rem';
    document.querySelector('.api-section').appendChild(note);
  }
}

// Router to determine which init function to run
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('clientForm')) initForm();
  if (document.getElementById('clientsTable')) initList();
  if (document.getElementById('viewName')) initView();
});