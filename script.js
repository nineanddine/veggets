let cart = [];

/* --- SIDEBAR CONTROLS --- */
function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

/* --- MENU QUANTITY CONTROLS (Main Menu Cards) --- */
function increaseQty(id) {
    let qty = document.getElementById(id);
    qty.innerText = parseInt(qty.innerText) + 1;
}

function decreaseQty(id) {
    let qty = document.getElementById(id);
    let current = parseInt(qty.innerText);
    if (current > 1) {
        qty.innerText = current - 1;
    }
}

/* --- DYNAMIC SAUCE IMAGE SWAP --- */
function updateSauceImage() {
    const select = document.getElementById('sauceFlavor');
    const imgElement = document.getElementById('sauceImg');
    
    // Get the data-img attribute from the currently selected option
    const selectedOption = select.options[select.selectedIndex];
    const newSrc = selectedOption.getAttribute('data-img');
    
    // Update the image shown on the card
    if (newSrc) {
        imgElement.src = newSrc;
    }
}

/* --- ADD TO CART LOGIC --- */
function addSauceToCart() {
    const select = document.getElementById('sauceFlavor');
    const flavor = select.value;
    const flavorImg = document.getElementById('sauceImg').src;
    const fullName = "Dip Sauce (" + flavor + ")";
    
    // Uses the same logic as regular items but with dynamic flavor info
    addToCart(fullName, 10, 'qty9', flavorImg); 
}

function addToCart(name, price, qtyId, imgSrc) {
    let qtyElement = document.getElementById(qtyId);
    let qty = parseInt(qtyElement.innerText);
    
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: qty,
            img: imgSrc
        });
    }

    // Reset menu counter back to 1
    qtyElement.innerText = "1";

    renderCart();
    
    // Automatically open sidebar to show the user the item was added
    const sidebar = document.getElementById("cartSidebar");
    if (!sidebar.classList.contains("active")) {
        toggleCart();
    }
}

/* --- CART DRAWER ACTIONS (Inside Sidebar) --- */
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function changeCartQty(index, amount) {
    if (cart[index].qty + amount > 0) {
        cart[index].qty += amount;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

/* --- UI RENDERING --- */
function renderCart() {
    const cartList = document.getElementById("cartItemsList");
    let total = 0;
    let itemCount = 0;
    let summaryText = "";

    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; color:#999; margin-top:50px;">Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.qty;
            total += itemTotal;
            itemCount += item.qty;

            // HTML for the Sidebar Item
            cartList.innerHTML += `
                <div class="cart-item-row">
                    <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">₱${item.price}</span>
                        <div class="qty-control" style="margin: 5px 0;">
                            <button onclick="changeCartQty(${index}, -1)" style="width:20px; height:20px; padding:0; cursor:pointer;">-</button>
                            <span style="color:black; font-size:12px; margin: 0 5px;">${item.qty}</span>
                            <button onclick="changeCartQty(${index}, 1)" style="width:20px; height:20px; padding:0; cursor:pointer;">+</button>
                        </div>
                    </div>
                    <div style="text-align:right">
                        <div class="item-final-price">₱${itemTotal}</div>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; cursor:pointer; font-size:14px; color:red; margin-top:5px;">🗑️</button>
                    </div>
                </div>
            `;

            summaryText += `${item.name} x${item.qty} = ₱${itemTotal}\n`;
        });
    }

    // 1. Update Sidebar Header Count
    document.getElementById("cartCount").textContent = itemCount;
    
    // 2. Update Sidebar Bottom Total
    document.getElementById("estimatedTotal").textContent = total.toFixed(2);

    // 3. Update the Checkout Section Summary (The Textarea)
    const summaryArea = document.getElementById("summary");
    if (summaryArea) {
        summaryArea.value = cart.length > 0 ? summaryText + "\nTOTAL: ₱" + total : "";
    }
}

/* --- FINAL CHECKOUT PROCESS --- */
function checkout() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();

    if (cart.length === 0) {
        alert("Your cart is empty! Please add some Veggets first. 😊");
        return;
    }

    if (name === "" || address === "") {
        alert("Please provide your name and delivery address so we know where to send the food!");
        
        const sidebar = document.getElementById("cartSidebar");
        if (sidebar.classList.contains("active")) {
            toggleCart();
        }
        document.getElementById("contact").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    alert(`Thank you, ${name}! 🎉 Your order has been placed. We are preparing your food for delivery to ${address}.`);

    cart = [];
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    renderCart();
    
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar.classList.contains("active")) {
        toggleCart();
    }
}