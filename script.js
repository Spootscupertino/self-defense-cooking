// THE DATA: Our 3 Self-Defense Recipes
const recipes = [
    {
        title: "Carbonara Rescue",
        time: "12 Mins",
        difficulty: "Medium",
        desc: "The Guanciale Protocol. No cream. Just eggs, cheese, and survival."
    },
    {
        title: "Iron-Clad Steak",
        time: "25 Mins",
        difficulty: "Hard",
        desc: "Heavy sear, butter baste. Do not set off the smoke alarm."
    },
    {
        title: "Honey Sriracha Wings",
        time: "45 Mins",
        difficulty: "Easy",
        desc: "Game day defense. Sweet heat that hits back."
    }
];

// THE LOGIC: Inject them into the HTML
const grid = document.getElementById('recipe-grid');

recipes.forEach(recipe => {
    // Create the card HTML
    const card = document.createElement('div');
    card.classList.add('card');
    
    card.innerHTML = `
        <h2>${recipe.title}</h2>
        <div class="tags">
            <span class="tag">⏱ ${recipe.time}</span>
            <span class="tag">⚔️ ${recipe.difficulty}</span>
        </div>
        <p>${recipe.desc}</p>
    `;
    
    // Add to the grid
    grid.appendChild(card);
});

console.log("Dojo Loaded. Sensei Chilla is watching.");
