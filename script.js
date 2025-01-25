const form = document.getElementById("add-url-form");
const tagInput = document.getElementById("tag-input");
const urlInput = document.getElementById("url-input");
const tagsList = document.getElementById("tags-list");
const formControlPlaceholder = document.getElementById("form-control-placeholder");

const formInputPlaceholder = "Create new group";
for (let i = 0; i < formInputPlaceholder.length; i++) {
  const span = document.createElement("span");
  span.textContent = formInputPlaceholder.charAt(i);
  span.style.transitionDelay = `${i * 25}ms`;
  formControlPlaceholder.appendChild(span);
}

// Save URL and tag
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tag = tagInput.value.trim();
  const url = urlInput.value.trim();

  if (tag && url) {
    const storageData = await chrome.storage.local.get("tags") || {};
    const tags = storageData.tags || {};

    if (!tags[tag]) {
      tags[tag] = [];
    }
    tags[tag].push(url);

    await chrome.storage.local.set({ tags });
    tagInput.value = "";
    urlInput.value = "";
    renderTags(tags);
  }
});

// Render tags and URLs
async function renderTags(data) {
  tagsList.innerHTML = "";
  for (const [tag, urls] of Object.entries(data)) {
    const tagElement = document.createElement("div");
    tagElement.className = "tag";
    tagElement.textContent = tag;

    const linksElement = document.createElement("div");
    linksElement.className = "links";

    urls.forEach((url) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = url;
      linksElement.appendChild(link);
    });

    tagElement.addEventListener("click", () => {
      linksElement.style.display =
        linksElement.style.display === "block" ? "none" : "block";
    });

    tagsList.appendChild(tagElement);
    tagsList.appendChild(linksElement);
  }
}

// Load data on popup open
chrome.storage.local.get("tags", (data) => {
  const tags = data.tags || {};
  renderTags(tags);
});

// add a new group for links
function addGroup(labelName, links) {
  // Obtém os dados armazenados
  chrome.storage.sync.get("groups", (data) => {
    const groups = data.groups || {}; // Pega os grupos existentes ou inicializa como objeto vazio
    if (!groups[labelName]) {
      // Adiciona um novo grupo
      groups[labelName] = links;
      // Salva os grupos atualizados
      chrome.storage.sync.set({ groups }, () => {
        console.log(`Group '${labelName}' added!`);
      });
    } else {
      console.log(`Group '${labelName}' already exists.`);
    }
  });
}

function addLinkToGroup(labelName, link) {
  chrome.storage.sync.get("groups", (data) => {
    const groups = data.groups || {};
    if (groups[labelName]) {
      // Evita duplicação de links
      if (!groups[labelName].includes(link)) {
        groups[labelName].push(link);
        chrome.storage.sync.set({ groups }, () => {
          console.log(`Link '${link}' added to group '${labelName}'.`);
        });
      } else {
        console.log(`Link '${link}' already exists in group '${labelName}'.`);
      }
    } else {
      console.log(`Group '${labelName}' does not exist.`);
    }
  });
}

function removeGroup(labelName) {
  chrome.storage.sync.get("groups", (data) => {
    const groups = data.groups || {};
    if (groups[labelName]) {
      delete groups[labelName];
      chrome.storage.sync.set({ groups }, () => {
        console.log(`Group '${labelName}' removed.`);
      });
    } else {
      console.log(`Group '${labelName}' does not exist.`);
    }
  });
}

function getAllGroups(callback) {
  chrome.storage.sync.get("groups", (data) => {
    const groups = data.groups || {};
    callback(groups); // Retorna os grupos via callback
  });
}

// Adicionar um novo grupo
addGroup("work", ["https://example.com"]);

// Adicionar mais links a um grupo existente
addLinkToGroup("work", "https://github.com");

// Listar todos os grupos
getAllGroups((groups) => {
  console.log(groups);
});
