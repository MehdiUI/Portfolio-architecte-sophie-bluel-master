// URL de l'API
const apiUrl = 'http://localhost:5678/api/';

// Votre clé d’API
const apiKey = 'qhKb/ItvcS74PyETTgOJag==TwyJrn1zrN66Fzyq';

async function fetchWorks() {
  try {
    // Construire l'URL complète
    const url = `${apiUrl}works`;

    // Effectuer la requête avec la clé d’API
    const response = await fetch(url, {
      method: 'GET', // Méthode GET pour récupérer les données
      headers: {
        'Content-Type': 'application/json', // Format des données
        // 'Authorization': `Bearer ${apiKey}`, <token>
      },
    });

    // Vérifier si la réponse est correcte
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Convertir la réponse en JSON
    const data = await response.json();

    // Afficher les données dans la console
    console.log('Données récupérées avec clé d’API :', data);
    buildWorks(data)
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Appel de la fonction
fetchWorks(); // Remplacez 'data' par le chemin approprié de votre API


function buildWorks (works){
  for (let i = 0; i < works.length; i++) { 
    const work = works[i]
    const workElement = document.createElement("figure");
    workElement.dataset.id = works[i].id
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = work.title
    const galleryContainer=document.querySelector(".gallery")
    galleryContainer.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(captionElement);

  }
}



async function fetchData() {
  try {
    // Récupérer les projets et les catégories via l'API
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const works = await worksResponse.json();

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();

    // Construire les filtres
    buildFilter(categories);

    // Construire les projets
    buildWorks(works);

    // Configurer les filtres
    setupFilters(works);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

function setupFilters(works) {
  const filterContainer = document.getElementById("filter-container");

  if (!filterContainer) {
    console.error("Conteneur de filtres introuvable.");
    return;
  }

  // Ajouter un événement "click" à chaque bouton
  filterContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "LI" && target.dataset.categoryId) {
      const categoryId = target.dataset.categoryId;

      // Vider la galerie avant de reconstruire les projets filtrés
      const galleryContainer = document.querySelector(".gallery");
      galleryContainer.innerHTML = "";

      // Filtrer les projets en fonction de l'ID
      const filteredWorks =
        categoryId === "all"
          ? works
          : works.filter((work) => work.categoryId === parseInt(categoryId));

      // Afficher les projets filtrés
      buildWorks(filteredWorks);
    }
  });
}

// Lancer le processus
fetchData();
