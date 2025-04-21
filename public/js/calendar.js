import firebaseConfig from "./firebaseConfig.js"
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

 const events = {
    '2025-04-22': [
        { title: 'Team Meeting', time: '10:00 AM', description: 'Quarterly planning session' },
        { title: 'Client Lunch', time: '12:30 PM', description: 'Discuss new project requirements' }
    ],
    '2023-11-20': [
        { title: 'Project Deadline', time: 'All Day', description: 'Submit final deliverables' }
    ],
    '2023-11-25': [
        { title: 'Workshop', time: '9:00 AM - 12:00 PM', description: 'Team building activities' },
        { title: 'Happy Hour', time: '5:00 PM', description: 'Celebrate project completion' }
    ],
    '2023-12-01': [
        { title: 'New Project Kickoff', time: '2:00 PM', description: 'Initial meeting with stakeholders' }
    ]
};

const auth = getAuth(firebaseConfig.app);
const db = getFirestore(firebaseConfig.app);

// Initialize with auth check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("User not authenticated");
        document.getElementById("new-ev").disabled = true;
    }
});

const submit = document.getElementById("new-ev");
submit.addEventListener("click", async function(event) {
    event.preventDefault();
    
    const ev = {
        title: document.getElementById("title").value,
        about: document.getElementById("about").value,
        image: document.getElementById("image").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value
    };

    // Validate input
    if (!ev.title || !ev.about || !ev.image || !ev.location) {
        alert("Please enter all information");
        return;
    }

    try {
        console.log("Processing...");
        const docRef = await addDoc(collection(db, "events"), ev);
        console.log("Document written with ID: ", docRef.id);
        alert("Event added successfully!");
        
        // Clear form or update UI
        document.getElementById("title").value = "";
        document.getElementById("about").value = "";
        document.getElementById("image").value = "";
        document.getElementById("location").value = "";
        document.getElementById("date").value = "";
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error: " + error.message);
    }
});

// Initialize date picker
document.getElementById('date-input').addEventListener('change', function(e) {
    const selectedDate = e.target.value;
    showEventsForDate(selectedDate);
});

// Display events for selected date
async function showEventsForDate(dateStr) {
    const eventsList = document.getElementById('events-list');
    const dateHeader = document.getElementById('selected-date-header');
    
    if (!dateStr) {
        dateHeader.textContent = 'Please select a date';
        eventsList.innerHTML = '';
        return;
    }
    
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateHeader.textContent = date.toLocaleDateString('en-US', options);

    const col = collection(db, events);
    const events = await getDocs(col);
    let html = '';

    events.forEach((event) =>{
        let id = event.id;
        let data = event.data();
        if (dateStr == data.date){
            console.log("We did it")
        }
    });


    
    if (events[dateStr]) {
        eventsList.innerHTML = '';
        events[dateStr].forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Time:</strong> ${event.time}</p>
                <p>${event.description}</p>
            `;
            eventsList.appendChild(eventItem);
        });
    } else {
        eventsList.innerHTML = '<p class="no-events">No events scheduled for this date</p>';
    }
}

// Set default date to today (optional)
window.onload = function() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('date-input').value = dateStr;
    showEventsForDate(dateStr);
};