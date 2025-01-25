function renderGroups(groups) {
    const tagsList = document.getElementById("tags-list");
    tagsList.innerHTML = ""; // Limpa o conteúdo antes de renderizar

    Object.entries(groups).forEach(([labelName, links]) => {
        // Criar o elemento do accordion
        const accordion = document.createElement("div");
        accordion.className = "accordion";

        // Header do accordion
        const header = document.createElement("div");
        header.className = "accordion-header";
        header.textContent = labelName;

        // Adicionar evento de clique para expandir/recolher
        header.addEventListener("click", () => {
            content.style.display = content.style.display === "block" ? "none" : "block";
        });

        // Container dos links (content)
        const content = document.createElement("div");
        content.className = "accordion-content";

        // Adicionar os links ao content
        links.forEach((link) => {
            const linkContainer = document.createElement("div");
            linkContainer.style.display = "flex";
            linkContainer.style.alignItems = "center";
            linkContainer.style.marginBottom = "5px";

            // Ícone de editar
            const editIcon = document.createElement("span");
            editIcon.className = "icon";
            editIcon.textContent = "✏️";
            editIcon.title = "Edit link";
            editIcon.addEventListener("click", () => {
                const newUrl = prompt("Edit URL:", link);
                if (newUrl) {
                    updateLink(labelName, link, newUrl);
                }
            });

            // Ícone de deletar
            const deleteIcon = document.createElement("span");
            deleteIcon.className = "icon";
            deleteIcon.textContent = "🗑️";
            deleteIcon.title = "Delete link";
            deleteIcon.addEventListener("click", () => {
                removeLink(labelName, link);
            });

            // Link em si
            const url = document.createElement("a");
            url.href = link;
            url.textContent = link;
            url.target = "_blank";
            url.style.marginRight = "auto";
            url.style.color = "#007BFF";

            // Ícone de abrir link
            const openIcon = document.createElement("span");
            openIcon.className = "icon open-icon";
            openIcon.textContent = "🔗";
            openIcon.title = "Open in new tab";
            openIcon.addEventListener("click", () => {
                window.open(link, "_blank");
            });

            // Adicionar tudo ao container do link
            linkContainer.appendChild(editIcon);
            linkContainer.appendChild(deleteIcon);
            linkContainer.appendChild(url);
            linkContainer.appendChild(openIcon);

            // Adicionar o linkContainer ao content
            content.appendChild(linkContainer);
        });

        // Adicionar o header e o content ao accordion
        accordion.appendChild(header);
        accordion.appendChild(content);

        // Adicionar o accordion ao container principal
        tagsList.appendChild(accordion);
    });
}

// Exemplo de dados para testar
const exampleGroups = {
    work: ["https://example.com", "https://github.com"],
    research: ["https://wikipedia.org", "https://arxiv.org"],
};

// Chamar a função de renderização com os grupos de exemplo
renderGroups(exampleGroups);

// Funções de exemplo para manipulação
function updateLink(labelName, oldLink, newLink) {
    chrome.storage.sync.get("groups", (data) => {
        const groups = data.groups || {};
        if (groups[labelName]) {
            const linkIndex = groups[labelName].indexOf(oldLink);
            if (linkIndex > -1) {
                groups[labelName][linkIndex] = newLink;
                chrome.storage.sync.set({ groups }, () => {
                    console.log("Link updated!");
                    renderGroups(groups); // Atualizar a UI
                });
            }
        }
    });
}

function removeLink(labelName, link) {
    chrome.storage.sync.get("groups", (data) => {
        const groups = data.groups || {};
        if (groups[labelName]) {
            groups[labelName] = groups[labelName].filter((l) => l !== link);
            chrome.storage.sync.set({ groups }, () => {
                console.log("Link removed!");
                renderGroups(groups); // Atualizar a UI
            });
        }
    });
}
