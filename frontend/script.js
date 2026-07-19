// Change this to your deployed backend URL once you deploy it on Render.
// Example: const API_BASE = "https://scm-backend.onrender.com/api/contacts";
const API_BASE = "https://smartcontactmanager-sx7j.onrender.com/api/contacts";

const form = document.getElementById("contact-form");
const idField = document.getElementById("contact-id");
const nameField = document.getElementById("name");
const phoneField = document.getElementById("phone");
const emailField = document.getElementById("email");
const addressField = document.getElementById("address");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formError = document.getElementById("form-error");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearSearchBtn = document.getElementById("clear-search-btn");
const sortSelect = document.getElementById("sort-select");

const listEl = document.getElementById("contact-list");

let isEditing = false;

// ---------- API calls ----------

async function fetchContacts() {
  const sortBy = sortSelect.value;
  const url = sortBy ? `${API_BASE}?sortBy=${sortBy}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load contacts.");
  return res.json();
}

async function searchContacts(name) {
  const res = await fetch(`${API_BASE}/search?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Search failed.");
  return res.json();
}

async function createContact(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add contact.");
  return data;
}

async function updateContactRequest(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update contact.");
  return data;
}

async function deleteContactRequest(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete contact.");
}

// ---------- Rendering ----------

function renderContacts(contacts) {
  listEl.innerHTML = "";

  if (!contacts.length) {
    listEl.innerHTML = `<p class="empty-state">No contacts yet. Add your first one above.</p>`;
    return;
  }

  contacts.forEach((c) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
      <div class="contact-info">
        <h3>${escapeHtml(c.name)}</h3>
        <p>${escapeHtml(c.phone)}</p>
        ${c.email ? `<p>${escapeHtml(c.email)}</p>` : ""}
        ${c.address ? `<p>${escapeHtml(c.address)}</p>` : ""}
      </div>
      <div class="contact-actions">
        <button class="secondary edit-btn" data-id="${c.id}">Edit</button>
        <button class="danger delete-btn" data-id="${c.id}">Delete</button>
      </div>
    `;
    listEl.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => startEdit(btn.dataset.id, contacts))
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => handleDelete(btn.dataset.id))
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---------- Load / refresh ----------

async function loadAndRender() {
  try {
    listEl.innerHTML = `<p class="empty-state">Loading contacts...</p>`;
    const contacts = await fetchContacts();
    renderContacts(contacts);
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

// ---------- Form handling ----------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.classList.add("hidden");

  const payload = {
    name: nameField.value.trim(),
    phone: phoneField.value.trim(),
    email: emailField.value.trim(),
    address: addressField.value.trim(),
  };

  try {
    if (isEditing) {
      await updateContactRequest(idField.value, payload);
    } else {
      await createContact(payload);
    }
    resetForm();
    await loadAndRender();
  } catch (err) {
    formError.textContent = err.message;
    formError.classList.remove("hidden");
  }
});

function startEdit(id, contacts) {
  const contact = contacts.find((c) => String(c.id) === String(id));
  if (!contact) return;

  isEditing = true;
  idField.value = contact.id;
  nameField.value = contact.name;
  phoneField.value = contact.phone;
  emailField.value = contact.email || "";
  addressField.value = contact.address || "";

  submitBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  isEditing = false;
  form.reset();
  idField.value = "";
  submitBtn.textContent = "Add Contact";
  cancelEditBtn.classList.add("hidden");
  formError.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", resetForm);

async function handleDelete(id) {
  if (!confirm("Delete this contact?")) return;
  try {
    await deleteContactRequest(id);
    await loadAndRender();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Search & sort ----------

searchBtn.addEventListener("click", async () => {
  const name = searchInput.value.trim();
  if (!name) {
    await loadAndRender();
    return;
  }
  try {
    const results = await searchContacts(name);
    renderContacts(results);
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
});

clearSearchBtn.addEventListener("click", async () => {
  searchInput.value = "";
  await loadAndRender();
});

sortSelect.addEventListener("change", loadAndRender);

// ---------- Init ----------

loadAndRender();
