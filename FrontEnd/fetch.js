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

    // Convertir la réponse en JSON
    const data = await response.json();

    // Afficher les données dans la console
    console.log('Données récupérées avec clé d’API :', data);
    buildWorks(data)
    buildFilters(data);
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}
// Appel de la fonction
fetchWorks(); // 


function buildWorks (works){
    // Sélectionner le conteneur de la galerie
    const galleryContainer = document.querySelector('.gallery');
  
    // Réinitialiser la galerie pour éviter d'ajouter les projets en double
    galleryContainer.innerHTML = '';
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

// Objet pour mapper les categoryId aux noms lisibles
const categoryNames = {
  1: "Objets",
  2: "Appartements",
  3: "Hôtels & Restaurants",
};

// Fonction pour créer les boutons dynamiquement
function buildFilters(works) {
  // Récupérer la section où insérer les boutons
  const portfolioSection = document.getElementById('portfolio');

  // Créer ou récupérer le conteneur des filtres
  let filterContainer = document.getElementById('filter-container');
  if (!filterContainer) {
    filterContainer = document.createElement('ul'); // Utiliser une liste `<ul>`
    filterContainer.id = 'filter-container';
    portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.gallery'));
  } else {
    filterContainer.innerHTML = ''; // Réinitialiser le contenu si nécessaire
  }

  // Ajouter un bouton "Tous"
  const allButton = document.createElement('li');
  allButton.classList.add('active'); // Par défaut, "Tous" est actif
  allButton.innerText = 'Tous';
  allButton.addEventListener('click', () => {
    filterWorks(works, null); // Aucun filtre
    setActiveButton(allButton); // Appliquer la classe active
  });
  filterContainer.appendChild(allButton);

  // Extraire les catégories uniques des données
  const categories = [...new Set(works.map(work => work.categoryId))];

  // Créer un bouton pour chaque catégorie
  categories.forEach(categoryId => {
    const listItem = document.createElement('li');
    // Utiliser le nom lisible pour la catégorie ou "Catégorie X" par défaut
    listItem.innerText = categoryNames[categoryId] || `Catégorie ${categoryId}`;
    listItem.addEventListener('click', () => {
      filterWorks(works, categoryId); // Filtrer par catégorie
      setActiveButton(listItem); // Appliquer la classe active
    });
    filterContainer.appendChild(listItem);
  });
}

// Fonction pour appliquer le filtre
function filterWorks(works, categoryId) {
  // Filtrer les projets par `categoryId` ou tout afficher si `categoryId` est null
  const filteredWorks = categoryId
    ? works.filter(work => work.categoryId === categoryId)
    : works;

  // Mettre à jour l'affichage des projets filtrés
  buildWorks(filteredWorks);
}

// Fonction pour gérer l'état actif des boutons
function setActiveButton(activeListItem) {
  const buttons = document.querySelectorAll('#filter-container li');
  buttons.forEach(button => button.classList.remove('active')); // Retirer la classe active de tous les boutons
  activeListItem.classList.add('active'); // Appliquer la classe active au bouton cliqué
}