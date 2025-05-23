import firebaseConfig from "./firebaseConfig.js"
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

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
        date: document.getElementById("date").value,
        userId: auth.currentUser.uid
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

    const col = collection(db, "events");
    const events = await getDocs(col);
    let html = '';
    let found = false;

    events.forEach((event) =>{
        let id = event.id;
        let data = event.data();
        if (dateStr == data.date){
            found = true;
            const showDeleteButton = auth.currentUser && auth.currentUser.uid === data.userId
            html += `
                <div class="event-item" style="background-image: url('${data.image}');">
                    <div class="content-overlay">
                    <h3>${data.title}</h3>
                        <div style="padding:1em;color:white;">
                            <p>${data.about}</p>
                            <p>Location: ${data.location}</p>
                            <p>Date: ${data.date}</p>
                `;
                if (showDeleteButton){
                    html += `<button id="${id}" class="delete-btn" data-event-id="${id}">Delete</button>`;
                }
                html += `
                        </div>
                    </div>
                </div>
            `;
        }
    });
    if (!found){
        html += '<p class="no-events">No events scheduled for this date</p>'
    }
    eventsList.innerHTML = html;
}

// Add this near the top of your module
export function setupDeleteHandlers() {
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const eventId = event.target.dataset.eventId;
            try {
                await deleteEvent(eventId);
                event.target.closest('.event-item').remove();
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Failed to delete event: " + error.message);
            }
        }
    });
}

// Your delete function (make sure it's exported if needed elsewhere)
async function deleteEvent(eventId) {
    const db = getFirestore();
    await deleteDoc(doc(db, "events", eventId));
}

window.onload = function() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('date-input').value = dateStr;
    showEventsForDate(dateStr);
};

document.addEventListener('DOMContentLoaded', setupDeleteHandlers);