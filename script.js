const pageTitle = document.getElementById("page-title");

const pages = {
    home: "Dashboard",
    inventory: "My Inventory",
    catalog: "All Items",
    locations: "Locations",
    prices: "Prices",
    settings: "Settings"
};

// Navigation
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

        const page = link.dataset.page;
        pageTitle.textContent = pages[page] || "Dashboard";

        document.querySelectorAll(".collection-section").forEach(section => {
            section.style.display = "none";
        });

        document.querySelector(".welcome").style.display = "none";

        if (page === "home") {
            document.querySelector(".welcome").style.display = "";
            
            document.querySelectorAll(".collection-section").forEach(section => {
                section.style.display = "";
            });

            document.getElementById("catalog-view").style.display = "none";
            document.getElementById("inventory-view").style.display = "none";

        } else if (page === "inventory") {
            document.getElementById("inventory-view").style.display = "";
            renderInventory();

        } else {
            document.querySelector(".welcome").style.display = "";
            document.querySelector(".welcome h2").textContent = pages[page];
            document.querySelector(".welcome p:last-child").textContent =
                "This section is ready for us to build next.";
        }
    });
});

 // Category selection and inventory tracking

const catalogView = document.getElementById("catalog-view");
const catalogItems = document.getElementById("catalog-items");
const categoryHeading = document.getElementById("category-heading");

// Load previously saved quantities
let inventoryData = {};

try {
    inventoryData = JSON.parse(
        localStorage.getItem("paliaInventory") || "{}"
    );
} catch (error) {
    inventoryData = {};
}

// Save quantities
function saveInventory() {
    localStorage.setItem(
        "paliaInventory",
        JSON.stringify(inventoryData)
    );
}

// Display Inventory Categories
function renderInventory() {
    document.getElementById("inventory-category-grid").style.display = "grid";
    document.getElementById("inventory-items").style.display = "none";
    document.getElementById("inventory-back").style.display = "none";

    document.querySelector("#inventory-view .section-heading h3").textContent =
        "Browse Your Inventory";

    document.querySelector("#inventory-view .section-heading .eyebrow").textContent =
        "YOUR PERSONAL COLLECTION";
}

// Display items in a selected Inventory category
function showInventoryCategory(category) {
    const inventoryItems = document.getElementById("inventory-items");
    const categoryGrid = document.getElementById("inventory-category-grid");

    const ownedItems = itemCatalog.filter(item =>
        item.category === category
    );

    categoryGrid.style.display = "none";
    inventoryItems.style.display = "grid";
    document.getElementById("inventory-back").style.display = "";

    document.querySelector("#inventory-view .section-heading h3").textContent =
        category;

    document.querySelector("#inventory-view .section-heading .eyebrow").textContent =
        "YOUR " + category.toUpperCase();

    if (ownedItems.length === 0) {
        inventoryItems.innerHTML = `
            <div class="empty-state">
                <span>♜</span>
                <h3>No ${category.toLowerCase()} in your inventory yet</h3>
                <p>Add quantities to these items to see them here.</p>
            </div>
        `;
        return;
    }

    inventoryItems.innerHTML = ownedItems.map(item => {
        const saved = inventoryData[item.name] || {};

        const normal = saved.normal || {
            character: saved.character || 0,
            home: saved.home || 0
        };

        const starred = saved.starred || {
            character: 0,
            home: 0
        };

        return `
            <div class="item-card inventory-item">

                <div class="item-name">${item.name}</div>

                <div class="quantity-fields">

                    <div class="quality-group">
                        <h4>Normal Quality</h4>

                        <label>
                            Character Inventory
                            <input type="number" min="0" step="1"
                                value="${normal.character}"
                                data-item="${encodeURIComponent(item.name)}"
                                data-quality="normal"
                                data-location="character">
                        </label>

                        <label>
                            Home Storage
                            <input type="number" min="0" step="1"
                                value="${normal.home}"
                                data-item="${encodeURIComponent(item.name)}"
                                data-quality="normal"
                                data-location="home">
                        </label>

                        <div class="item-total normal-total">
                            Normal Total: ${Number(normal.character) + Number(normal.home)}
                        </div>
                    </div>

                    <div class="quality-group">
                        <h4>Star Quality</h4>

                        <label>
                            Character Inventory
                            <input type="number" min="0" step="1"
                                value="${starred.character}"
                                data-item="${encodeURIComponent(item.name)}"
                                data-quality="starred"
                                data-location="character">
                        </label>

                        <label>
                            Home Storage
                            <input type="number" min="0" step="1"
                                value="${starred.home}"
                                data-item="${encodeURIComponent(item.name)}"
                                data-quality="starred"
                                data-location="home">
                        </label>

                        <div class="item-total starred-total">
                            Star Total: ${Number(starred.character) + Number(starred.home)}
                        </div>
                    </div>

                </div>
            </div>
        `;
    }).join("");
}

// Display a category
let currentCategory = "";

function showCategory(category) {
    currentCategory = category;

    document.querySelector(".welcome").style.display = "none";

    document.querySelectorAll(".collection-section").forEach(section => {
        section.style.display = "none";
    });

    catalogView.style.display = "";
    catalogView.style.marginTop = "25px";

    document.querySelectorAll("#dashboard-categories .category-card").forEach(card => {
        card.style.borderColor = "";
    });

    const selectedCard = document.querySelector(
        `#dashboard-categories .category-card[data-category="${category}"]`
    );

    if (selectedCard) {
        selectedCard.style.borderColor = "var(--gold)";
    }

    pageTitle.textContent = category;
    categoryHeading.textContent = category;

    const filteredItems = itemCatalog
        .filter(item => item.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredItems.length === 0) {
        catalogItems.innerHTML = `
            <div class="empty-state">
                <span>♜</span>
                <h3>No items added yet</h3>
                <p>This category is ready for your item guide.</p>
            </div>
        `;
    } else {
        catalogItems.innerHTML = filteredItems.map(item => `
            <div class="item-card" style="display: flex; align-items: center; gap: 15px;">

                ${item.image ? `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        style="width: 65px; height: 65px; object-fit: contain; flex-shrink: 0;"
                    >
                ` : ""}

                <button
                    type="button"
                    class="item-name item-name-button"
                    data-item-name="${encodeURIComponent(item.name)}"
                >${item.name}</button>

            </div>
        `).join("");
    }
}

function showItemDetail(item) {
    document.querySelectorAll(".collection-section").forEach(section => {
        section.style.display = "none";
    });

    const detailView = document.getElementById("item-detail-view");
    detailView.style.display = "";
    detailView.style.marginTop = "25px";

    pageTitle.textContent = item.name;

    const detailImage = document.getElementById("detail-image");
    detailImage.src = item.image || "";
    detailImage.alt = item.name;
    detailImage.style.display = item.image ? "" : "none";

    document.getElementById("detail-name").textContent = item.name;
    document.getElementById("detail-rarity").textContent = item.rarity || "—";
    document.getElementById("detail-price").textContent =
        item.price == null ? "—" : item.price + " Gold";
    document.getElementById("detail-star-price").textContent =
        item.starPrice == null ? "—" : item.starPrice + " Gold";
    document.getElementById("detail-location").textContent = item.location || "—";
    document.getElementById("detail-obtain").textContent = item.obtain || "—";
}

// Open an item's personal page
catalogItems.addEventListener("click", event => {
    const button = event.target.closest(".item-name-button");

    if (!button) return;

    const itemName = decodeURIComponent(button.dataset.itemName);
    const selectedItem = itemCatalog.find(item => item.name === itemName);

    if (selectedItem) {
        showItemDetail(selectedItem);
    }
});

// Return to the item category
document.getElementById("item-detail-back").addEventListener("click", () => {
    showCategory(currentCategory);
});


// Dashboard category buttons
document.querySelectorAll(".category-card:not(.inventory-category-card)").forEach(card => {
    card.addEventListener("click", () => {
        showCategory(card.dataset.category);
    });
});

// Back to Dashboard Categories
document.getElementById("catalog-back").addEventListener("click", () => {
    catalogView.style.display = "none";
    document.querySelector(".welcome").style.display = "";

    document.querySelectorAll(".collection-section").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById("dashboard-categories").style.display = "";
    pageTitle.textContent = "Dashboard";
});

// Inventory category buttons
document.querySelectorAll(".inventory-category-card").forEach(card => {
    card.addEventListener("click", () => {
        showInventoryCategory(card.dataset.category);
    });
});

// Back to Inventory Categories
document.getElementById("inventory-back").addEventListener("click", () => {
    renderInventory();
});

// Save Inventory Quantities
document.getElementById("inventory-items").addEventListener("input", event => {
    if (!event.target.matches("input[data-item]")) return;

    const itemName = decodeURIComponent(event.target.dataset.item);
    const quality = event.target.dataset.quality;
    const location = event.target.dataset.location;

    if (!inventoryData[itemName]) {
        inventoryData[itemName] = {};
    }

    const saved = inventoryData[itemName];

    if (!saved.normal) {
        saved.normal = {
            character: Number(saved.character) || 0,
            home: Number(saved.home) || 0
        };
    }

    if (!saved.starred) {
        saved.starred = {
            character: 0,
            home: 0
        };
    }

    const quantity = Math.max(0, Math.floor(Number(event.target.value) || 0));

    saved[quality][location] = quantity;

    saveInventory();

    const itemCard = event.target.closest(".inventory-item");

    const normalTotal =
        Number(saved.normal.character) + Number(saved.normal.home);

    const starredTotal =
        Number(saved.starred.character) + Number(saved.starred.home);

    itemCard.querySelector(".normal-total").textContent =
        `Normal Total: ${normalTotal}`;

    itemCard.querySelector(".starred-total").textContent =
        `Star Total: ${starredTotal}`;
});

const itemCatalog = [
...[
        { name: "Aeroflow Mask", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: null, obtain: null, image: "Images/Aeroflow Mask.png" },
        { name: "Amethyst", category: "Materials", rarity: "Epic", price: 1500, starPrice: null, location: "Elderwood", obtain: "Mine Palium and Platinum deposits", image: "images/Amethyst.png" },
        { name: "Ancient Amber", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Elderwood", obtain: "Forage from Ancient Trees", image: "images/Ancient Amber.png" },
        { name: "Ancient Wood", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Elderwood", obtain: "Chop Ancient Trees", image: "images/Ancient Wood.png" },
        { name: "Ancient Wood Plank", category: "Materials", rarity: "Abundant", price: 2, starPrice: null, location: "Crafting", obtain: "Craft at a Basic or Heavy Sawmill", image: "images/Ancient Wood Plank.png" },
        { name: "Aquamarine", category: "Materials", rarity: "Rare", price: 525, starPrice: null, location: "Elderwood", obtain: "Mine Iron and Gold deposits", image: "images/Aquamarine.png" },
        { name: "Ashwood Plank", category: "Materials", rarity: "Abundant", price: 2, starPrice: null, location: "Crafting", obtain: "Craft at a Basic or Heavy Sawmill", image: "images/Ashwood Plank.png" },
        { name: "Azure Chapaa Tail", category: "Materials", rarity: "Epic", price: 690, starPrice: null, location: "Bahari Bay", obtain: "Hunt Azure Chapaa", image: "images/Azure Chapaa Tail.png" },
        { name: "Banded Muujin Mane", category: "Materials", rarity: "Rare", price: 195, starPrice: null, location: "Bahari Bay", obtain: "Hunt Banded Muujin", image: "images/Banded Muujin Mane.png" },
        { name: "Birch Amber", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Kilima Valley", obtain: "Forage from Birch Trees", image: "images/Birch Amber.png" },
        { name: "Bluebristle Muujin Mane", category: "Materials", rarity: "Epic", price: 955, starPrice: null, location: "Bahari Bay", obtain: "Hunt Bluebristle Muujin", image: "images/Bluebristle Muujin Mane.png" },
        { name: "Bootleg Aeroflow Mask", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Amber Echo Store", obtain: "Purchase from Amber Echo Store", image: "images/Bootleg Aeroflow Mask.png" },
        { name: "Bootleg Hydroflow Mask", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Amber Echo Store", obtain: "Purchase from Amber Echo Store", image: "images/Bootleg Hydroflow Mask.png" },
        { name: "Bootleg Pyroflow Mask", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Amber Echo Store", obtain: "Purchase from Amber Echo Store", image: "images/Bootleg Pyroflow Mask.png" },
        { name: "Bootleg Terraflow Mask", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Amber Echo Store", obtain: "Purchase from Amber Echo Store", image: "images/Bootleg Terraflow Mask.png" },
        { name: "Ceramic", category: "Materials", rarity: "Common", price: 6, starPrice: null, location: "Crafting", obtain: "Smelt Clay at a Basic or Heavy Smelter", image: "images/Ceramic.png" },
        { name: "Citrine", category: "Materials", rarity: "Rare", price: 400, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Clay, Stone, or Whitestone deposits", image: "images/Citrine.png" },
        { name: "Clay", category: "Materials", rarity: "Common", price: 2, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Clay deposits", image: "images/Clay.png" },
        { name: "Coal", category: "Materials", rarity: "Common", price: null, starPrice: null, location: "Sandy Paws rewards", obtain: "Random reward from a Sandy Paws Present", image: "images/Coal.png" },
        { name: "Copper Bar", category: "Materials", rarity: "Uncommon", price: 31, starPrice: null, location: "Crafting", obtain: "Smelt Copper Ore", image: "images/Copper Bar.png" },
        { name: "Copper Ore", category: "Materials", rarity: "Common", price: 4, starPrice: null, location: "Kilima Valley", obtain: "Mine Copper deposits", image: "images/Copper Ore.png" },
        { name: "Crab Shell", category: "Materials", rarity: "Epic", price: null, starPrice: null, location: "Bahari Bay", obtain: "Catch crabs", image: "images/Crab Shell.png" },
        { name: "Elder Sernuk Antlers", category: "Materials", rarity: "Rare", price: 185, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Elder Sernuk or Golden Sernuk", image: "images/Elder Sernuk Antlers.png" },
        { name: "Elder Shmole Spore", category: "Materials", rarity: "Rare", price: 215, starPrice: null, location: "Elderwood", obtain: "Hunt Elder Shmole", image: "images/Elder Shmole Spore.png" },
        { name: "Emerald", category: "Materials", rarity: "Epic", price: 650, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Copper and Silver deposits", image: "images/Emerald.png" },
        { name: "Emerald Ogopuu Scale", category: "Materials", rarity: "Rare", price: 230, starPrice: null, location: "Elderwood", obtain: "Hunt Emerald Ogopuu", image: "images/Emerald Ogopuu Scale.png" },
        { name: "Fabric", category: "Materials", rarity: "Uncommon", price: 48, starPrice: null, location: "Crafting", obtain: "Craft at a Fabric Loom or buy from the Material Store", image: "images/Fabric.png" },
        { name: "Flint", category: "Materials", rarity: "Common", price: 4, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Stone deposits", image: "images/Flint.png" },
        { name: "Flow Infused Plank", category: "Materials", rarity: "Common", price: 13, starPrice: null, location: "Crafting", obtain: "Craft Flow-Infused Wood at a Basic or Heavy Sawmill", image: "images/Flow Infused Plank.png" },
        { name: "Flow Infused Wood", category: "Materials", rarity: "Common", price: 11, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Chop Flow-Infused Trees", image: "images/Flow Infused Wood.png" },
        { name: "Fossilized Lantern Resin", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Royal Highlands", obtain: "Forage from Lantern Ash Trees", image: "images/Fossilized Lantern Resin.png" },
        { name: "Fur", category: "Materials", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Chapaa or Muujin", image: "images/Fur.png" },
        { name: "Garnet", category: "Materials", rarity: "Uncommon", price: 180, starPrice: null, location: "Bahari Bay", obtain: "Mine Iron and Gold deposits", image: "images/Garnet.png" },
        { name: "Glass Bulb", category: "Materials", rarity: "Uncommon", price: 140, starPrice: null, location: "Crafting", obtain: "Craft at a Glass Furnace", image: "images/Glass Bulb.png" },
        { name: "Glass Pane", category: "Materials", rarity: "Common", price: 50, starPrice: null, location: "Crafting", obtain: "Craft at a Glass Furnace", image: "images/Glass Pane.png" },
        { name: "Gold Bar", category: "Materials", rarity: "Epic", price: 510, starPrice: null, location: "Crafting", obtain: "Smelt Gold Ore", image: "images/Gold Bar.png" },
        { name: "Gold Ore", category: "Materials", rarity: "Rare", price: 36, starPrice: null, location: "Bahari Bay, Elderwood", obtain: "Mine Gold deposits", image: "images/Gold Ore.png" },
        { name: "Heartwood", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Bahari Bay", obtain: "Chop Pine Trees", image: "images/Heartwood.png" },
        { name: "Heartwood Plank", category: "Materials", rarity: "Abundant", price: 2, starPrice: null, location: "Crafting", obtain: "Craft at a Basic or Heavy Sawmill", image: "images/Heartwood Plank.png" },
        { name: "Hollow Jaakcat Floof", category: "Materials", rarity: "Epic", price: 1056, starPrice: null, location: "Elderwood", obtain: "Hunt Hollow Jaakcat", image: "images/Hollow Jaakcat Floof.png" },
        { name: "Hydroflow Mask", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: null, obtain: null, image: "images/Hydroflow Mask.png" },
        { name: "Iridescent Scales", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Fishing locations", obtain: "Obtain through fishing", image: "images/Iridescent Scales.png" },
        { name: "Iron Bar", category: "Materials", rarity: "Uncommon", price: 43, starPrice: null, location: "Crafting", obtain: "Smelt Iron Ore", image: "images/Iron Bar.png" },
        { name: "Iron Ore", category: "Materials", rarity: "Common", price: 8, starPrice: null, location: "Bahari Bay", obtain: "Mine Iron deposits", image: "images/Iron Ore.png" },
        { name: "Jaakcat Floof", category: "Materials", rarity: "Uncommon", price: 77, starPrice: null, location: "Elderwood", obtain: "Hunt Jaakcat", image: "images/Jaakcat Floof.png" },
        { name: "Jaakcat Fur", category: "Materials", rarity: "Common", price: 16, starPrice: null, location: "Elderwood", obtain: "Hunt Jaakcat", image: "images/Jaakcat Fur.png" },
        { name: "Jaakcat Meat", category: "Materials", rarity: "Common", price: 16, starPrice: null, location: "Elderwood", obtain: "Hunt Jaakcat", image: "images/Jaakcat Meat.png" },
        { name: "Jadium Bar", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Crafting", obtain: "Smelt Jadium Ore", image: "images/Jadium Bar.png" },
        { name: "Jadium Ore", category: "Materials", rarity: "Common", price: null, starPrice: null, location: "Elderwood", obtain: "Mine Jadium deposits", image: "images/Jadium Ore.png" },
        { name: "Jasper", category: "Materials", rarity: "Epic", price: 550, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Stone and Whitestone deposits", image: "images/Jasper.png" },
        { name: "Juniper Amber", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Bahari Bay", obtain: "Forage from Juniper Trees", image: "images/Juniper Amber.png" },
        { name: "Lantern Ashwood", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Royal Highlands", obtain: "Chop Lantern Ash Trees", image: "images/Lantern Ashwood.png" },
        { name: "Leather", category: "Materials", rarity: "Common", price: 18, starPrice: null, location: "Crafting", obtain: "Craft at a Fabric Loom or buy from the Material Store", image: "images/Leather.png" },
        { name: "Midnight Jaakcat Floof", category: "Materials", rarity: "Rare", price: 207, starPrice: null, location: "Elderwood", obtain: "Hunt Midnight Jaakcat", image: "images/Midnight Jaakcat Floof.png" },
        { name: "Molten Ore", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: "Elderwood", obtain: "Mine occasionally or obtain from Ignits", image: "images/Molten Ore.png" },
        { name: "Muskin", category: "Materials", rarity: "Common", price: 18, starPrice: null, location: "Crafting", obtain: "Craft at a Fabric Loom", image: "images/Muskin.png" },
        { name: "Muujin Mane", category: "Materials", rarity: "Uncommon", price: 65, starPrice: null, location: "Bahari Bay", obtain: "Hunt Muujin", image: "images/Muujin Mane.png" },
        { name: "Oak Amber", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Kilima Valley", obtain: "Forage from Oak Trees", image: "images/Oak Amber.png" },
        { name: "Ogopuu Scale", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Elderwood", obtain: "Hunt Ogopuu", image: "images/Ogopuu Scale.png" },
        { name: "Ogopuu Skin", category: "Materials", rarity: "Common", price: null, starPrice: null, location: "Elderwood", obtain: "Hunt Ogopuu", image: "images/Ogopuu Skin.png" },
        { name: "Onyx", category: "Materials", rarity: "Rare", price: 400, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Copper and Silver deposits", image: "images/Onyx.png" },
        { name: "Palium Bar", category: "Materials", rarity: "Uncommon", price: 95, starPrice: null, location: "Crafting", obtain: "Smelt Palium Ore", image: "images/Palium Bar.png" },
        { name: "Palium Ore", category: "Materials", rarity: "Common", price: 12, starPrice: null, location: "Bahari Bay, Elderwood", obtain: "Mine Palium deposits", image: "images/Palium Ore.png" },
        { name: "Piksii Shmole Spore", category: "Materials", rarity: "Epic", price: null, starPrice: null, location: "Elderwood", obtain: "Hunt Piksii Shmole", image: "images/Piksii Shmole Spore.png" },
        { name: "Pine Amber", category: "Materials", rarity: "Epic", price: 350, starPrice: null, location: "Bahari Bay", obtain: "Forage from Pine Trees", image: "images/Pine Amber.png" },
        { name: "Plant Fiber", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Forage from plants", image: "images/Plant Fiber.png" },
        { name: "Platinum Bar", category: "Materials", rarity: "Legendary", price: null, starPrice: null, location: "Crafting", obtain: "Smelt Platinum Ore", image: "images/Platinum Bar.png" },
        { name: "Platinum Ore", category: "Materials", rarity: "Epic", price: null, starPrice: null, location: "Elderwood", obtain: "Mine Platinum deposits", image: "images/Platinum Ore.png" },
        { name: "Proudhorned Sernuk Antlers", category: "Materials", rarity: "Epic", price: 230, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Proudhorned Sernuk or Royal Sernuk", image: "images/Proudhorned Sernuk Antlers.png" },
        { name: "Pyroflow Mask", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: null, obtain: null, image: "images/Pyroflow Mask.png" },
        { name: "Quartz", category: "Materials", rarity: "Uncommon", price: 200, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Clay, Copper, and Silver deposits", image: "images/Quartz.png" },
        { name: "Ruby", category: "Materials", rarity: "Legendary", price: 4000, starPrice: null, location: "Elderwood", obtain: "Mine Palium and Platinum deposits", image: "images/Ruby.png" },
        { name: "Sapphire", category: "Materials", rarity: "Epic", price: 1000, starPrice: null, location: "Elderwood", obtain: "Mine Iron and Gold deposits", image: "images/Sapphire.png" },
        { name: "Sapwood", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Kilima Valley", obtain: "Chop Oak, Birch, and Juniper Trees", image: "images/Sapwood.png" },
        { name: "Sapwood Plank", category: "Materials", rarity: "Abundant", price: 2, starPrice: null, location: "Crafting", obtain: "Craft at a Basic or Heavy Sawmill", image: "images/Sapwood Plank.png" },
        { name: "Sea Glass", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: "Bahari Bay", obtain: "Forage Shells, Coral, Elder Clam Mushrooms, and Unopened Oysters", image: "images/Sea Glass.png" },
        { name: "Sernuk Antlers", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Sernuk", image: "images/Sernuk Antlers.png" },
        { name: "Sernuk Hide", category: "Materials", rarity: "Common", price: 32, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Sernuk", image: "images/Sernuk Hide.png" },
        { name: "Shmole Spore", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Elderwood", obtain: "Hunt Shmole", image: "images/Shmole Spore.png" },
        { name: "Silk", category: "Materials", rarity: "Rare", price: 900, starPrice: null, location: "Crafting", obtain: "Craft at a Fabric Loom or buy from the Material Store", image: "images/Silk.png" },
        { name: "Silk Thread", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Bahari Bay", obtain: "Catch Rare or Epic Bugs", image: "images/Silk Thread.png" },
        { name: "Silky Fluff", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Ranching", obtain: "Raise Flutterfox", image: "images/Silky Fluff.png" },
        { name: "Silver Bar", category: "Materials", rarity: "Rare", price: 255, starPrice: null, location: "Crafting", obtain: "Smelt Silver Ore", image: "images/Silver Bar.png" },
        { name: "Silver Ore", category: "Materials", rarity: "Uncommon", price: 18, starPrice: null, location: "Bahari Bay", obtain: "Mine Silver deposits", image: "images/Silver Ore.png" },
        { name: "Spotted Chapaa Tail", category: "Materials", rarity: "Uncommon", price: 35, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Hunt Spotted Chapaa", image: "images/Spotted Chapaa Tail.png" },
        { name: "Stone", category: "Materials", rarity: "Abundant", price: 1, starPrice: null, location: "Kilima Valley, Bahari Bay", obtain: "Mine Stone deposits", image: "images/Stone.png" },
        { name: "Stone Brick", category: "Materials", rarity: "Abundant", price: 3, starPrice: null, location: "Crafting", obtain: "Smelt Stone at a Basic or Heavy Smelter", image: "images/Stone Brick.png" },
        { name: "Striped Chapaa Tail", category: "Materials", rarity: "Rare", price: 80, starPrice: null, location: "Bahari Bay", obtain: "Hunt Striped Chapaa", image: "images/Striped Chapaa Tail.png" },
        { name: "Sunstone", category: "Materials", rarity: "Epic", price: null, starPrice: null, location: "Elderwood", obtain: "Mine Jadium Ore", image: "images/Sunstone.png" },
        { name: "Terraflow Mask", category: "Materials", rarity: "Rare", price: null, starPrice: null, location: null, obtain: null, image: "images/Terraflow Mask.png" },
        { name: "Waveback Ogopuu Scale", category: "Materials", rarity: "Epic", price: null, starPrice: null, location: "Elderwood", obtain: "Hunt Waveback Ogopuu", image: "images/Waveback Ogopuu Scale.png" },
        { name: "Whitestone", category: "Materials", rarity: "Common", price: null, starPrice: null, location: "Elderwood", obtain: "Mine Whitestone deposits", image: "images/Whitestone.png" },
        { name: "Whitestone Slab", category: "Materials", rarity: "Uncommon", price: null, starPrice: null, location: "Crafting", obtain: "Process Whitestone", image: "images/Whitestone Slab.png" }
    ],

    ...[
        // FORAGEABLES
{ name: "Black Pearl", category: "Gatherables", rarity: "Epic", price: 390, starPrice: 585, location: "Elderwood", obtain: "Forage from Elder Clam Mushrooms", image: "images/Black Pearl.png" },
{ name: "Briar Daisy", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Bahari Bay", obtain: "Foraging, Ranching, Rummage Piles, Treasure Chests", image: "images/Briar Daisy.png" },
{ name: "Brightshroom", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Bahari Bay, Royal Highlands", obtain: "Foraging, Ranching, Rummage Piles, Treasure Chests", image: "images/Brightshroom.png" },
{ name: "Coral", category: "Gatherables", rarity: "Uncommon", price: 24, starPrice: 36, location: "Bahari Bay, Royal Highlands", obtain: "Foraging along the coast", image: "images/Coral.png" },
{ name: "Crystal Lake Lotus", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Kilima Valley", obtain: "Foraging, Ranching, General Store", image: "images/Crystal Lake Lotus.png" },
{ name: "Cypress Tree", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Cypress Tree.png" },
{ name: "Dawnspur Lily", category: "Gatherables", rarity: "Common", price: 9, starPrice: 13, location: "Royal Highlands", obtain: "Foraging", image: "images/Dawnspur Lily.png" },
{ name: "Dragon's Beard Peat", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Bahari Bay", obtain: "Foraging, Foraging Guild, Rummage Piles, Treasure Chests", image: "images/Dragon's Beard Peat.png" },
{ name: "Elderflower", category: "Gatherables", rarity: "Epic", price: 145, starPrice: 217, location: "Elderwood", obtain: "Foraging", image: "images/Elderflower.png" },
{ name: "Elderwood Lotus", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Elderwood", obtain: "Foraging, Ranching", image: "images/Elderwood Lotus.png" },
{ name: "Elderwood Orchid", category: "Gatherables", rarity: "Common", price: 9, starPrice: 13, location: "Elderwood", obtain: "Foraging, Ranching, Piksii Grove", image: "images/Elderwood Orchid.png" },
{ name: "Emerald Carpet Moss", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Kilima Valley", obtain: "Foraging, Treasure Chests", image: "images/Emerald Carpet Moss.png" },
{ name: "Extremely Aged Cheese", category: "Gatherables", rarity: "Epic", price: 250, starPrice: null, location: "Royal Highlands", obtain: "Mining, Hunting, Foraging, Bug Catching, Jackpot Bag", image: "images/Extremely Aged Cheese.png" },
{ name: "Floatfish Mushroom", category: "Gatherables", rarity: "Common", price: 9, starPrice: 13, location: "Elderwood", obtain: "Foraging, Hunting Shmoles, Ranching", image: "images/Floatfish Mushroom.png" },
{ name: "Flowtato", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Elderwood", obtain: "Foraging", image: "images/Flowtato.png" },
{ name: "Golden Fern", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Royal Highlands", obtain: "Foraging", image: "images/Golden Fern.png" },
{ name: "Heartdrop Lily", category: "Gatherables", rarity: "Epic", price: 100, starPrice: 150, location: "Bahari Bay", obtain: "Foraging, Ranching, Rummage Piles, Foraging Guild", image: "images/Heartdrop Lily.png" },
{ name: "Heat Root", category: "Gatherables", rarity: "Rare", price: 60, starPrice: 90, location: "Bahari Bay", obtain: "Foraging, Foraging Guild, Zeki's Prize Wheel, Rummage Piles", image: "images/Heat Root.png" },
{ name: "Honey", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Bahari Bay, Elderwood", obtain: "Foraging from hanging tree hives, Ranching", image: "images/Honey.png" },
{ name: "Kopaa Nuts", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Elderwood", obtain: "Foraging, Piksii Grove", image: "images/Kopaa Nuts.png" },
{ name: "Mountain Morel", category: "Gatherables", rarity: "Common", price: 11, starPrice: 16, location: "Bahari Bay, Kilima Valley, Housing Plot", obtain: "Foraging, General Store, Ranching", image: "images/Mountain Morel.png" },
{ name: "Pearl", category: "Gatherables", rarity: "Rare", price: 115, starPrice: 172, location: "Bahari Bay", obtain: "Opening Unopened Oysters, quests, Treasure Chests", image: "images/Pearl.png" },
{ name: "Piksii Berries", category: "Gatherables", rarity: "Common", price: 9, starPrice: 13, location: "Elderwood", obtain: "Foraging, Ranching, Piksii Grove", image: "images/Piksii Berries.png" },
{ name: "Royal Heather", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Royal Highlands", obtain: "Foraging, Treasure Chests", image: "images/Royal Heather.png" },
{ name: "Royal Wisteria", category: "Gatherables", rarity: "Epic", price: 145, starPrice: 217, location: "Kilima Valley", obtain: "Foraging, Flower Bloom Event", image: "images/Royal Wisteria.png" },
{ name: "Shell", category: "Gatherables", rarity: "Common", price: 12, starPrice: 18, location: "Bahari Bay, Royal Highlands", obtain: "Foraging along beaches", image: "images/Shell.png" },
{ name: "Spice Sprouts", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Kilima Valley", obtain: "Foraging, General Store, Zeki's Prize Wheel", image: "images/Spice Sprouts.png" },
{ name: "Staircase Mushroom", category: "Gatherables", rarity: "Common", price: 9, starPrice: 13, location: "Elderwood, Royal Highlands", obtain: "Foraging, Hunting Shmoles, Ranching", image: "images/Staircase Mushroom.png" },
{ name: "Sundrop Lily", category: "Gatherables", rarity: "Common", price: 11, starPrice: 16, location: "Bahari Bay, Kilima Valley", obtain: "Foraging, General Store, Ranching, Treasure Chests", image: "images/Sundrop Lily.png" },
{ name: "Sweet Leaf", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Bahari Bay", obtain: "Foraging, Foraging Guild, Rummage Piles, Treasure Chests", image: "images/Sweet Leaf.png" },
{ name: "Wild Garlic", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Bahari Bay, Kilima Valley", obtain: "Foraging, General Store, Zeki's Prize Wheel", image: "images/Wild Garlic.png" },
{ name: "Wild Ginger", category: "Gatherables", rarity: "Uncommon", price: 23, starPrice: 34, location: "Kilima Valley, Royal Highlands", obtain: "Foraging, Zeki's Prize Wheel", image: "images/Wild Ginger.png" },
{ name: "Wild Green Onion", category: "Gatherables", rarity: "Uncommon", price: 11, starPrice: 16, location: "Kilima Valley", obtain: "Foraging, Zeki's Prize Wheel", image: "images/Wild Green Onion.png" },

// SEEDS
{ name: "Acorn", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: "Kilima Valley", obtain: "Foraging from Oak Trees, Foraging Guild, Ancient Galdur Statue", image: "images/Acorn.png" },
{ name: "Ancient Wood Seed", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: "Elderwood", obtain: "Foraging from Ancient Trees", image: "images/Ancient Wood Seed.png" },
{ name: "Flow Acorn", category: "Gatherables", rarity: "Rare", price: 47, starPrice: null, location: null, obtain: "Ancient Galdur Statue", image: "images/Flow Acorn.png" },
{ name: "Flow Juniper Seed", category: "Gatherables", rarity: "Rare", price: 47, starPrice: null, location: null, obtain: "Ancient Galdur Statue", image: "images/Flow Juniper Seed.png" },
{ name: "Flow Pinecone", category: "Gatherables", rarity: "Rare", price: 47, starPrice: null, location: null, obtain: "Ancient Galdur Statue", image: "images/Flow Pinecone.png" },
{ name: "Flow Samara", category: "Gatherables", rarity: "Rare", price: 47, starPrice: null, location: null, obtain: "Ancient Galdur Statue", image: "images/Flow Samara.png" },
{ name: "Juniper Seed", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: "Bahari Bay", obtain: "Foraging from Juniper Trees, Foraging Guild, Ancient Galdur Statue", image: "images/Juniper Seed.png" },
{ name: "Lantern Ash Seed", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: "Royal Highlands", obtain: "Foraging from Lantern Ash Trees", image: "images/Lantern Ash Seed.png" },
{ name: "Pinecone", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: "Bahari Bay", obtain: "Foraging from Pine Trees, Foraging Guild, Ancient Galdur Statue", image: "images/Pinecone.png" },
{ name: "Samara", category: "Gatherables", rarity: "Uncommon", price: 19, starPrice: null, location: null, obtain: "Foraging from Birch Trees", image: "images/Samara.png" },

// DECORATIVE FLOWERS
{ name: "Anemone Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Catch Garden Mantis, Bug Catching Guild", image: "images/Anemone Flower.png" },
{ name: "Ancient Bush", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Elderwood", obtain: "Piksii Blossom Bounce", image: "images/Ancient Bush.png" },
{ name: "Bahari Nettle Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Paper Lantern Bug, Bug Catching Guild", image: "images/Bahari Nettle Flower.png" },
{ name: "Baharricenia Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Bahari Bay", obtain: "Catch Bahari Crab, Bug Catching Guild", image: "images/Baharricenia Flower.png" },
{ name: "Belafontine's Rosebush", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Royal Highlands", obtain: "Lunar Paths, Path of the Briar", image: "images/Belafontine's Rosebush.png" },
{ name: "Black Rose Flower", category: "Gatherables", rarity: "Common", price: null, starPrice: null, location: null, obtain: "Lunar Paths, Path of the Ghastly", image: "images/Black Rose Flower.png" },
{ name: "Blue Hydrangea Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Kilima Valley", obtain: "Catch Duskwing Butterfly, Flower Bloom Event", image: "images/Blue Hydrangea Flower.png" },
{ name: "Bluebell Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Bahari Bay", obtain: "Catch Spineshell Crab, Flower Bloom Event", image: "images/Bluebell Flower.png" },
{ name: "Cave Cap Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Cerulean Cicada", image: "images/Cave Cap Flower.png" },
{ name: "Chapaatail Flower", category: "Gatherables", rarity: "Common", price: 13, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Brushtail Dragonfly, Flower Bloom Event", image: "images/Chapaatail Flower.png" },
{ name: "Coastal Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Coastal Bush.png" },
{ name: "Cottonball Flower", category: "Gatherables", rarity: "Common", price: 13, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Cottonball Flower.png" },
{ name: "Datura Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Bahari Bay", obtain: "Catch Lunar Fairy Moth", image: "images/Datura Flower.png" },
{ name: "Elderwood Cosmo", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Elderwood", obtain: "Piksii Blossom Bounce", image: "images/Elderwood Cosmo.png" },
{ name: "Elderwood Fern", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Elderwood", obtain: "Piksii Blossom Bounce", image: "images/Elderwood Fern.png" },
{ name: "Elderwood Lilac", category: "Gatherables", rarity: "Common", price: 32, starPrice: null, location: "Elderwood", obtain: "Piksii Blossom Bounce", image: "images/Elderwood Lilac.png" },
{ name: "Enfield's Rosebush", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Royal Highlands", obtain: "Lunar Paths, Path of the Briar", image: "images/Enfield's Rosebush.png" },
{ name: "Fern", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Fern.png" },
{ name: "Fiddlefrond Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Inky Dragonfly", image: "images/Fiddlefrond Flower.png" },
{ name: "Flowering Black Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Black Bush.png" },
{ name: "Flowering Blue Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Blue Bush.png" },
{ name: "Flowering Orange Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Orange Bush.png" },
{ name: "Flowering Purple Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Purple Bush.png" },
{ name: "Flowering Red Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Red Bush.png" },
{ name: "Flowering Yellow Bush", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Flowering Yellow Bush.png" },
{ name: "Forget-Me-Not Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Garden Ladybug", image: "images/Forget-Me-Not Flower.png" },
{ name: "Forsythia Flower", category: "Gatherables", rarity: "Common", price: 13, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Spotted Stinkbug, Flower Bloom Event", image: "images/Forsythia Flower.png" },
{ name: "Gardenia Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Common Blue Butterfly, Flower Bloom Event", image: "images/Gardenia Flower.png" },
{ name: "Giant Mushroom", category: "Gatherables", rarity: "Common", price: 64, starPrice: null, location: "Elderwood", obtain: "Piksii Blossom Bounce", image: "images/Giant Mushroom.png" },
{ name: "Grimalkintail Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Common Field Cricket", image: "images/Grimalkintail Flower.png" },
{ name: "Hemitomes Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Common Bark Cicada", image: "images/Hemitomes Flower.png" },
{ name: "Lavender Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Catch Garden Millipede", image: "images/Lavender Flower.png" },
{ name: "Lunar Anemone Flower", category: "Gatherables", rarity: "Common", price: null, starPrice: null, location: "Maji Market", obtain: "Luna New Year Stamp Cards", image: "images/Lunar Anemone Flower.png" },
{ name: "Mixed Hydrangea Flower", category: "Gatherables", rarity: "Common", price: null, starPrice: null, location: "Housing Plot", obtain: "Founders Keepers quest, Flower Bloom Event", image: "images/Mixed Hydrangea Flower.png" },
{ name: "Nandina Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Spitfire Cicada", image: "images/Nandina Flower.png" },
{ name: "Pale Paintbrush Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Brighteye Butterfly", image: "images/Pale Paintbrush Flower.png" },
{ name: "Pink Hydrangea Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Kilima Valley", obtain: "Flower Bloom Event", image: "images/Pink Hydrangea Flower.png" },
{ name: "Pinky Pompom Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Catch Gossamer Veil Moth", image: "images/Pinky Pompom Flower.png" },
{ name: "Rose Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Bahari Bay, Kilima Valley", obtain: "Catch Kilima Night Moth, Flower Bloom Event", image: "images/Rose Flower.png" },
{ name: "Tiger Lily Flower", category: "Gatherables", rarity: "Common", price: 13, starPrice: null, location: "Kilima Valley", obtain: "Catch Proudhorned Stag Beetle, Flower Bloom Event", image: "images/Tiger Lily Flower.png" },
{ name: "Trillium Flower", category: "Gatherables", rarity: "Common", price: 13, starPrice: null, location: "Bahari Bay, Elderwood, Kilima Valley", obtain: "Catch Bahari Bee, Flower Bloom Event", image: "images/Trillium Flower.png" },
{ name: "Tulip Flower", category: "Gatherables", rarity: "Common", price: 15, starPrice: null, location: "Kilima Valley", obtain: "Catch Garden Leafhopper, Bug Catching Guild", image: "images/Tulip Flower.png" },
{ name: "Veronica Flower", category: "Gatherables", rarity: "Common", price: 16, starPrice: null, location: "Bahari Bay", obtain: "Catch Garden Snail, Bug Catching Guild", image: "images/Veronica Flower.png" }
    ].map(item => item),

...[
    "Amber Mantis",
    "Ancient Amber Beetle",
    "Ancient  Flowbug",
    "Azure Stonehopper",
    "Bahari Bee",
    "Bahari Crab",
    "Bahari Glowbug",
    "Banshee Beetle",
    "Blood Beetle",
    "Blue Crab",
    "Blushing Batterfly",
    "Brighteye Butterfly",
    "Brushtail Dragonfly",
    "Cave Piksii",
    "Cerulean Cicada",
    "Common Bark Cicada",
    "Common Blue Butterfly",
    "Common Field Cricket",
    "Draugr Beetle",
    "Duskwing Butterfly",
    "Enfield Moth",
    "Fairy Mantis",
    "Firebreathing Dragontly",
    "Flame Queen",
    "Flame-Horned Rockhopper",
    "Garden Ladybug",
    "Garden Leafhopper",
    "Garden Mantis",
    "Garden Millipede",
    "Garden Snail",
    "Golden Glory Bee",
    "Gossamer Veil Moth",
    "Grumpy Granite Rockhopper",
    "Hairy Millipede",
    "Heartdrop Mantis",
    "inky Dragonfly",
    "Jewelled Mantis",
    "Jewelwing Dragonfly",
    "Kilima Night Moth",
    "King Crab",
    "Leafstalker Mantis",
    "Lunar Fairy Moth",
    "Mossy Moth",
    "Nightshadow Batterfly",
    "Paper Lantern Bug",
    "Phoenix Moth",
    "Princess Ladybug",
    "Proudhorned Stag Beetle",
    "Pumpkin Rockhopper",
    "Rainbow-tipped Butterfly",
    "Raspberry Beetle",
    "Scintillating Centipede",
    "Shadvaraak Beetle",
    "Shimmerfly",
    "Spineshell Crab",
    "Spitfire Cicada",
    "Spotted Mantis",
    "Spotted Stinkbug",
    "Stripeshell Snail",
    "Sunburst Batterfly",
    "Vampire Crab",
    "Veil Piksii",
    "Whispering Widow Moth",
    "Will-o-wisp Rockhopper"
].map(name => ({
    name,
    category: "Bugs",
    image: `images/${name}.png`
})),

...[
    "Albino Eel",
    "Alligator Gar",
    "Amber Moray",
    "Ancient Cloudminnow",
    "Ancient Fish",
    "Ancient Koi",
    "Angelfish",
    "Bahari Bass",
    "Bahari Bream",
    "Bahari Pike",
    "Barracuda",
    "Bat Ray",
    "Beluga Sturgeon",
    "Black Sea Bass",
    "Blobfish",
    "Blue Marlin",
    "Blue Spotted Ray",
    "Bluefin Tuna",
    "Bronze Bluegill",
    "Cactus Moray",
    "Calico Koi",
    "Cantankerous Koi",
    "Channel Catfish",
    "Charged Cardinal",
    "Chub",
    "Cloudfish",
    "Copper Sturgeon",
    "Crimson Fangtooth",
    "Crucian Carp",
    "Cutthroat Trout",
    "Dart Eel",
    "Dawnray",
    "Devilfish",
    "Duskray",
    "Eleroo Eel",
    "Enchanted Pupfish",
    "Energized Piranha",
    "Enfield Eel",
    "Eyeless Minnow",
    "Fairy Carp",
    "Fairy Manta",
    "Fathead Minnow",
    "Flametongue Ray",
    "Freshwater Eel",
    "Giant Goldfish",
    "Giant Kilima Stingray",
    "Gillyfin",
    "Golden Salmon",
    "Green Anchovy",
    "Heather Manta",
    "Highland Floatfish",
    "Highland Shark",
    "Highland Sturgeon",
    "Highland Swiftscale",
    "Honey Loach",
    "Hypnotic Moray",
    "Indigo Lamprey",
    "Inyrevn Mermaid",
    "Jade Koi",
    "Kenli's Carp",
    "Kestra Eel",
    "Kilima Catfish",
    "Kilima Grayling",
    "Kilima Redfin",
    "Lake Shark",
    "Largemouth Bass",
    "Lesser Snakehead",
    "Long Nosed Unicorn Fish",
    "Majiri-of-War",
    "Major Manta",
    "Maws",
    "Midnight Floatfish",
    "Midnight Paddlefish",
    "Mini Mullet",
    "Mirror Carp",
    "Mossyfin",
    "Mottled Gobi",
    "Muddy Manta",
    "Mudminnow",
    "Mutated Angler",
    "Oily Anchovy",
    "Ooh Barracuda",
    "Orange Bluegill",
    "Paddlefish",
    "Painted Perch",
    "Palian Betta",
    "Piksii Floatfish",
    "Platinum Chad",
    "Prism Trout",
    "Radiant Sunfish",
    "Ragdoll Sturgeon",
    "Rainbow Trout",
    "Red-bellied Piranha",
    "Ribbontail Ray",
    "Rosy Bitterling",
    "Royal Betta",
    "Sabertoothed Anchovy",
    "Sardine",
    "Scarlet Koi",
    "Shimmerfin",
    "Sillyfin",
    "Silver Salmon",
    "Silvery Minnow",
    "Smallmouth Bass",
    "Spotted Bullhead",
    "Stalking Catfish",
    "Starry Bitterling",
    "Stickleback",
    "Stonefish",
    "Stormray",
    "Striped Dace",
    "Striped Sturgeon",
    "Swordfin Eel",
    "Thundering Eel",
    "Tinfin",
    "Toadstool Floatfish",
    "Turn Pike",
    "Umbraan Betta",
    "Umbran Carp",
    "Void Ray",
    "Willow Lamprey",
    "Yellow Perch",
    "Yellowfin Tuna"
].map(name => ({
    name,
    category: "Fish",
    image: `images/${name}.png`
}))
];

console.log("Palia catalog loaded:", itemCatalog.length, "items");
