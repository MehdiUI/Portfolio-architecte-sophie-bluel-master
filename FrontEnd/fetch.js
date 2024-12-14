// API Configuration
const API_CONFIG = {
  url: 'http://localhost:5678/api/',
  key: 'qhKb/ItvcS74PyETTgOJag==TwyJrn1zrN66Fzyq'
};

const CATEGORY_NAMES = {
  1: "Objets",
  2: "Appartements",
  3: "Hôtels & Restaurants"
};


async function fetchWorks() {
  try {
    const response = await fetch(`${API_CONFIG.url}works`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const works = await response.json();
    console.log('Données récupérées:', works);
    
    renderGallery(works);
    return works;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return [];
  }
}


function renderGallery(works) {
  const galleryContainer = document.querySelector('.gallery');

  galleryContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();
  
  works.forEach(work => {
    const workElement = document.createElement('figure');
    workElement.dataset.id = work.id;
    
    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    
    const captionElement = document.createElement('figcaption');
    captionElement.textContent = work.title;
    
    workElement.append(imageElement, captionElement);
    fragment.appendChild(workElement);
  });
  
  galleryContainer.appendChild(fragment);
}

function createFilterButtons(works) {
  const portfolioSection = document.getElementById('portfolio');
  
  let filterContainer = document.getElementById('filter-container');
  if (!filterContainer) {
    filterContainer = document.createElement('ul');
    filterContainer.id = 'filter-container';
    portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.gallery'));
  }
  
  filterContainer.innerHTML = '';
  

  const createFilterButton = (label, filterFn, isActive = false) => {
    const button = document.createElement('li');
    button.textContent = label;
    if (isActive) button.classList.add('active');
    button.addEventListener('click', () => {
      const filteredWorks = filterFn(works);
      renderGallery(filteredWorks);
      setActiveButton(button);
    });
    
    return button;
  };

  const allButton = createFilterButton('Tous', () => works, true);
  filterContainer.appendChild(allButton);
  const categories = [...new Set(works.map(work => work.categoryId))];
  categories.forEach(categoryId => {
    const categoryButton = createFilterButton(
      CATEGORY_NAMES[categoryId] || `Catégorie ${categoryId}`,
      works => works.filter(work => work.categoryId === categoryId)
    );
    filterContainer.appendChild(categoryButton);
  });
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('#filter-container li');
  buttons.forEach(btn => btn.classList.remove('active'));
  activeButton.classList.add('active');
}

function initGallery() {
  fetchWorks()
    .then(works => {
      if (works.length > 0) {
        createFilterButtons(works);
      }
    });
}

initGallery();