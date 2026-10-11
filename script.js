
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const productCards = [...document.querySelectorAll(".product-card")];
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryButtons = document.querySelectorAll(".category");
const productGrid = document.getElementById("productGrid");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

let cart = [];
let activeFilter = "All";
let searchTerm = "";
let toastTimer;

// Mobile navigation
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// Toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// Product filtering and search
function renderProducts() {
    let visibleCount = 0;

    productCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const matchesCategory =
            activeFilter === "All" || category === activeFilter;

        const matchesSearch = name.includes(searchTerm);

        const visible = matchesCategory && matchesSearch;
        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
}

function setFilter(filter) {
    activeFilter = filter;

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });

    renderProducts();
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter);
    });
});

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter);
        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.getElementById("showAll").addEventListener("click", () => {
    searchTerm = "";
    document.getElementById("searchInput").value = "";
    setFilter("All");
});

// Search bar
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchToggle").addEventListener("click", () => {
    searchBox.hidden = !searchBox.hidden;

    if (!searchBox.hidden) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        searchTerm = "";
        renderProducts();
    }
});

searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderProducts();
});

// Shopping bag
document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");

        const product = {
            name: card.dataset.name,
            price: Number(card.dataset.price)
        };

        cart.push(product);
        cartCount.textContent = cart.length;

        showToast(`${product.name} added to your bag!`);
    });
});

document.getElementById("cartButton").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your shopping bag is empty.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const summary = cart
        .map(item => `${item.name} - ₹${item.price}`)
        .join("\n");

    alert(
        `YOUR SHOPPING BAG\n\n${summary}\n\n` +
        `Total: ₹${total}\n\n` +
        "Demo only: checkout is not available."
    );
});

// Favorites
document.querySelectorAll(".favorite").forEach(button => {
    button.addEventListener("click", () => {
        const selected = button.classList.toggle("selected");

        button.textContent = selected ? "♥" : "♡";
        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

        showToast(
            selected
                ? "Added to your favorites."
                : "Removed from your favorites."
        );
    });
});

// Newsletter demonstration
document.getElementById("newsletterForm")
    .addEventListener("submit", event => {
        event.preventDefault();

        const email =
            document.getElementById("newsletterEmail").value.trim();

        if (!email) return;

        document.getElementById("newsletterStatus").textContent =
            "Thank you for your interest! This is a demo subscription.";

        event.target.reset();
    });

// Footer year
document.getElementById("year").textContent =
    new Date().getFullYear();
