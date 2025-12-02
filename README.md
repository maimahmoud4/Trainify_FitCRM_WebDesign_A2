#  FitCRM: Simple Client Manager (Frontend System)

**FitCRM (Trainify)** is a lightweight, frontend web application designed to help fitness professionals manage basic client information and track fitness goals.

This project fulfills the requirements of **CSCE 4502 - Assignment #2**.

---

##  Live Application & Repository

| Type | Link | Notes |
| :--- | :--- | :--- |
| **Live App Link** | [**INSERT YOUR LIVE NETLIFY OR GITHUB PAGES LINK HERE**] | Required for submission. |

---

##  Tech Stack & Requirements

This is a **Frontend-only** application (HTML, CSS, JavaScript).

| Category | Technology / Tool | Status |
| :--- | :--- | :--- |
| **Data Persistence** | **Browser LocalStorage** | **Implemented:** Client data is stored and persists across page refreshes. |
| **API Integration** | **Wger REST API** | **Implemented:** Fetches 5 suggested exercises for the Client View page. |
| **Design** | **Responsive Design** | **Implemented:** Uses CSS Flexbox/Grid and works well on desktop and mobile. |
| **Validation** | **JavaScript Validation** | **Implemented:** Includes checks for email format and required fields. |
| **Deployment** | **Netlify / GitHub Pages** | Required for submission. |

---

##  Core Features (Functional Requirements)

### 1. New Client Form
* **Add Client:** Form data is saved directly to LocalStorage upon successful validation and submission.

### 2. Client List View
* **Edit:** Repopulates the form with existing data before updating.
* **Delete:** Removes the client from the list and LocalStorage, prompting confirmation first.
* **Search:** Implements search functionality to retrieve client details by name.
* **View:** Clicking the client's name navigates to the detailed Client View page.

### 3. Client View
* Displays comprehensive client details (Name, Email, Phone, Goal, Start Date, Training history).
* Retrieves and displays **5 suggested exercises** via the Wger API.

---

##  How to Run Locally

1.  Clone or download this repository.
2.  Open the project folder.
3.  Double-click `index.html` to open it in your browser.
    * *Note on API:* If exercises do not load locally, it is due to browser security restrictions (CORS). This is resolved by deploying the app online (as required).

- **Developed by:** Mai Mahmoud
- **Course:** CSCE 4502 - Design of Web-based Systems (Fall 2025)
- **Institution:** The American University in Cairo (AUC)
