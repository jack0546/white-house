// ======= DATA =======
const MENU_DATA = [
  {id:1,name:'Goat Head Peppered',cat:'Main Meals',price:120,emoji:'🐐',desc:'Slow-cooked goat head with hot Ghanaian peppers, onions & spices. A bold local classic.',badge:'HOT'},
  {id:2,name:'Shrimps Stew with Fried Plantain & Rice',cat:'Seafood',price:150,emoji:'🦐',desc:'Tender shrimps in rich tomato-pepper stew served with crispy plantains and jasmine rice.',badge:'POPULAR'},
  {id:3,name:'Grilled Tilapia',cat:'Seafood',price:130,emoji:'🐟',desc:'Fresh Volta Lake tilapia grilled to perfection with a blend of Ghanaian herbs and spices.'},
  {id:4,name:'Jollof Rice with Chicken',cat:'Rice Dishes',price:80,emoji:'🍚',desc:'Ghana\'s beloved party rice cooked in tomato sauce with aromatic spices, served with grilled chicken.'},
  {id:5,name:'Fried Rice with Shrimp',cat:'Rice Dishes',price:95,emoji:'🍳',desc:'Wok-fried rice with fresh shrimps, vegetables, and a hint of ginger and soy.'},
  {id:6,name:'Banku & Tilapia',cat:'Local Dishes',price:100,emoji:'🫕',desc:'Fermented corn dumpling served with grilled tilapia and hot pepper sauce – a Ghanaian staple.'},
  {id:7,name:'Fufu & Light Soup',cat:'Local Dishes',price:85,emoji:'🍲',desc:'Hand-pounded cassava & plantain fufu in a light, aromatic palm nut broth with goat meat.'},
  {id:8,name:'Waakye',cat:'Rice Dishes',price:65,emoji:'🫘',desc:'Rice and beans cooked together the traditional Ghanaian way, served with spaghetti and gari.'},
  {id:9,name:'Lobster Platter',cat:'Seafood',price:220,emoji:'🦞',desc:'Fresh Atlantic lobster grilled and served with garlic butter, lemon, and seasoned vegetables.',badge:'SPECIAL'},
  {id:10,name:'Kelewele',cat:'Local Dishes',price:40,emoji:'🌶️',desc:'Spicy fried ripe plantain cubes seasoned with ginger, pepper, and ground spices.'},
  {id:11,name:'Ice Black Coffee',cat:'Drinks',price:25,emoji:'🧋',desc:'Rich cold brew coffee over crushed ice — refreshing and energizing.'},
  {id:12,name:'Fresh Coconut Water',cat:'Drinks',price:20,emoji:'🥥',desc:'Natural coconut water served chilled, straight from the coconut.'},
  {id:13,name:'Malt Drink',cat:'Drinks',price:15,emoji:'🥤',desc:'Classic Malta Guinness — sweet, malty, and rich.'},
  {id:14,name:'Kontomire Stew & Yam',cat:'Local Dishes',price:75,emoji:'🥬',desc:'Cocoyam leaves stewed with smoked fish and served with boiled yam.'},
  {id:15,name:'BBQ Chicken',cat:'Main Meals',price:110,emoji:'🍗',desc:'Marinated chicken slow-roasted over charcoal with smoky Ghanaian spices.'},
  {id:16,name:'Pepper Soup',cat:'Main Meals',price:90,emoji:'🍵',desc:'Spicy, aromatic broth with goat meat, uziza leaf and traditional Ghanaian spices.',badge:'NEW'},
];

let cart = [];
let orders = [];
let deliveryMode = 'delivery';
let isDark = false;
const DELIVERY_FEE = 15;
const RESTAURANT_PHONE = '233244107536';

// ======= PAGE NAV =======
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bnavEl = document.getElementById('bnav-' + page);
  if (bnavEl) bnavEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'order') renderCheckout();
  if (page === 'admin') updateAdminStats();
  if (page === 'menu') renderFullMenu('All');
}

// ======= THEME =======
function toggleTheme() {
  isDark = !isDark;
  document.body.setAttribute('data-theme', isDark ? 'dark' : '');
  document.querySelector('.theme-btn').textContent = isDark ? '☀️' : '🌙';
}

// ======= MOBILE NAV =======
function openMobileNav() { document.getElementById('mobile-nav').classList.add('open'); }
function closeMobileNav() { document.getElementById('mobile-nav').classList.remove('open'); }

// ======= TOAST =======
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ======= CART =======
function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function addToCart(item) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
  updateCartCount();
  showToast('🛒 ' + item.name + ' added!');
}

function removeFromCart(name) {
  cart = cart.filter(c => c.name !== name);
  renderCart();
  updateCartCount();
}

function changeQty(name, delta) {
  const item = cart.find(c => c.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else { renderCart(); updateCartCount(); }
  }
}

function updateCartCount() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const countEl = document.getElementById('cart-count');
  countEl.textContent = total;
  countEl.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const totalsEl = document.getElementById('cart-totals');
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🍽️</div><p>Your cart is empty</p><p style="font-size:0.85rem;color:var(--text-light);margin-top:4px">Add some delicious items!</p></div>';
    totalsEl.innerHTML = '';
    return;
  }
container.innerHTML = cart.map(item => {
    const imgSrc = IMAGE_MAP[item.name] ? `menu-images/${IMAGE_MAP[item.name]}` : null;
    const emojiHtml = imgSrc ? `<img src="${imgSrc}">` : (item.emoji || '🍽️');
    return `
    <div class="cart-item">
      <div class="cart-item-emoji">${emojiHtml}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">GH₵${item.price}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${escHtml(item.name)}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${escHtml(item.name)}',1)">+</button>
          <button class="remove-item" onclick="removeFromCart('${escHtml(item.name)}')">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const sub = getSubtotal();
  const fee = deliveryMode === 'delivery' ? DELIVERY_FEE : 0;
  const grand = sub + fee;
  totalsEl.innerHTML = `
    <div class="cart-total-row"><span>Subtotal</span><span>GH₵${sub}</span></div>
    <div class="cart-total-row"><span>Delivery fee</span><span>${fee > 0 ? 'GH₵' + fee : 'Free'}</span></div>
    <div class="cart-total-row grand"><span>Grand Total</span><span class="val">GH₵${grand}</span></div>`;
}

function getSubtotal() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }

function escHtml(s) { return s.replace(/'/g, "\\'"); }

// ======= MENU RENDER =======
// Map image filenames to menu items
const IMAGE_MAP = {
  'Goat Head Peppered': 'goat-head-prepared.jpg',
  'Shrimps Stew with Fried Plantain & Rice': 'Shrimps-Stew-with-Fried-Plantain-&-Rice.jpg',
  'Grilled Tilapia': 'Banku-&-Tilapia.jpg',
  'Jollof Rice with Chicken': 'jollof.jpg',
  'Fried Rice with Shrimp': 'Fried-Rice-with-Shrimp.jpg',
  'Banku & Tilapia': 'Banku-&-Tilapia.jpg',
  'Fufu & Light Soup': 'Fufu-with-Light-Soup.jpg',
  'Waakye': 'Waakye-Special.jpeg',
  'Lobster Platter': 'Grilled-Lobster-Tail.jpg',
  'Kelewele': 'Kelewele.jpg',
  'Ice Black Coffee': 'Sobolo.jpg',
  'Fresh Coconut Water': 'Fresh-Coconut-Water.jpg',
  'Malt Drink': 'Malt-Drink.png',
  'Kontomire Stew & Yam': 'Kontomire-Stew-&-Yam.webp',
  'BBQ Chicken': 'BBQ-Chicken.jpg',
  'Pepper Soup': 'Pepper-Soup.jpg',
  'Weekend Family Feast': 'Weekend-Family-Feast.jpg'
};

function renderMenuCard(item, showDelete = false) {
  const imgSrc = IMAGE_MAP[item.name] ? `menu-images/${IMAGE_MAP[item.name]}` : null;
  return `<div class="menu-card" data-cat="${item.cat}" data-id="${item.id}">
    <div class="menu-card-img">
      ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}
      ${imgSrc ? `<img src="${imgSrc}" alt="${item.name}">` : `<span>${item.emoji || '🍽️'}</span>`}
    </div>
    <div class="menu-card-body">
      <div class="menu-card-name">${item.name}</div>
      <div class="menu-card-desc">${item.desc}</div>
      <div class="menu-card-footer">
        <span class="menu-card-price">GH₵${item.price}</span>
        <div style="display:flex;gap:6px">
          ${showDelete ? `<button class="add-to-cart-btn" style="background:var(--red);color:white" onclick="deleteMenuItem(${item.id})" title="Delete">🗑️</button>` : ''}
          <button class="add-to-cart-btn" onclick='addToCart({name:"${item.name.replace(/"/g,"'")}",price:${item.price},emoji:"${item.emoji||'🍽️'}"})'  title="Add to cart">+</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderHomeMenuGrid() {
  const popular = MENU_DATA.slice(0, 6);
  document.getElementById('home-menu-grid').innerHTML = popular.map(i => renderMenuCard(i)).join('');
}

function renderFullMenu(cat = 'All') {
  let items = cat === 'All' ? MENU_DATA : MENU_DATA.filter(i => i.cat === cat);
  const search = document.getElementById('menu-search')?.value.toLowerCase() || '';
  if (search) items = items.filter(i => i.name.toLowerCase().includes(search) || i.desc.toLowerCase().includes(search));
  document.getElementById('full-menu-grid').innerHTML = items.length ? items.map(i => renderMenuCard(i)).join('') : '<p style="color:var(--text-muted)">No dishes found.</p>';
}

function renderMenuFilters() {
  const cats = ['All', ...new Set(MENU_DATA.map(i => i.cat))];
  document.getElementById('menu-filter').innerHTML = cats.map(c =>
    `<button class="filter-btn ${c==='All'?'active':''}" onclick="filterCategory('${c}')">${c}</button>`
  ).join('');
}

function filterCategory(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderFullMenu(cat);
}

function searchMenu(val) { renderFullMenu('All'); }

// ======= REVIEWS =======
const REVIEWS = [
  { name: 'Abena Mensah', initials: 'AM', stars: 5, text: 'The goat head pepper soup is absolutely divine! Reminds me of my grandmother\'s cooking. Will definitely be back.', date: 'May 2025' },
  { name: 'Kweku Asante', initials: 'KA', stars: 4, text: 'Excellent shrimp stew — fresh, well seasoned, perfect portion size. The plantains were crispy exactly how I like them.', date: 'Apr 2025' },
  { name: 'Ama Boateng', initials: 'AB', stars: 5, text: 'Best waakye in Osu! The service was warm and friendly. Highly recommend for authentic Ghanaian food lovers.', date: 'Apr 2025' },
  { name: 'Nii Armah', initials: 'NA', stars: 4, text: 'Ordered delivery and it arrived hot and well packaged. The fufu and light soup hit different on a rainy day!', date: 'Mar 2025' },
  { name: 'Akosua Frempong', initials: 'AF', stars: 4, text: 'Love the ambiance and the fresh coconut water! Great spot for a relaxed Ghanaian meal in Osu.', date: 'Mar 2025' },
  { name: 'Kofi Brempong', initials: 'KB', stars: 5, text: 'The lobster platter is worth every pesewa. White House never disappoints — quality food and great prices!', date: 'Feb 2025' },
];

function renderReviews() {
  document.getElementById('reviews-container').innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.initials}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>
    </div>`).join('');
}

// ======= CHECKOUT =======
function selectDelivery(mode) {
  deliveryMode = mode;
  ['delivery','pickup','dinein'].forEach(m => document.getElementById('opt-' + m).classList.remove('active'));
  document.getElementById('opt-' + mode).classList.add('active');
  const addrGroup = document.getElementById('address-group');
  addrGroup.style.display = mode === 'delivery' ? 'block' : 'none';
  renderCheckout();
}

function renderCheckout() {
  const itemsList = document.getElementById('checkout-items-list');
  const totalsEl = document.getElementById('checkout-totals');
  if (!itemsList) return;
  if (cart.length === 0) {
    itemsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:16px">No items in cart. <a onclick="showPage(\'menu\')" style="color:var(--gold);cursor:pointer">Browse menu →</a></p>';
    totalsEl.innerHTML = '';
    return;
  }
  itemsList.innerHTML = cart.map(c => {
    const imgSrc = IMAGE_MAP[c.name] ? `menu-images/${IMAGE_MAP[c.name]}` : null;
    const emojiHtml = imgSrc ? `<img src="${imgSrc}" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;">` : (c.emoji || '🍽️');
    return `<div style="display:flex;justify-content:space-between;font-size:0.9rem;padding:8px 0;border-bottom:1px solid var(--border)">
      <span>${emojiHtml} ${c.name} × ${c.qty}</span>
      <span style="color:var(--gold);font-weight:600">GH₵${c.price * c.qty}</span>
    </div>`;
  }).join('');
  const sub = getSubtotal();
  const fee = deliveryMode === 'delivery' ? DELIVERY_FEE : 0;
  const grand = sub + fee;
  totalsEl.innerHTML = `
    <div style="margin-top:12px;">
      <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:4px"><span>Subtotal</span><span>GH₵${sub}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:8px"><span>Delivery fee</span><span>${fee>0?'GH₵'+fee:'Free'}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:700;padding-top:8px;border-top:2px solid var(--gold)"><span>Grand Total</span><span style="color:var(--gold)">GH₵${grand}</span></div>
    </div>`;
  updateWhatsAppLink();
}

function updateWhatsAppLink() {
  const name = document.getElementById('cust-name')?.value || '';
  const phone = document.getElementById('cust-phone')?.value || '';
  const address = document.getElementById('cust-address')?.value || '';
  const notes = document.getElementById('order-notes')?.value || '';
  const sub = getSubtotal();
  const fee = deliveryMode === 'delivery' ? DELIVERY_FEE : 0;
  const grand = sub + fee;
  const itemList = cart.map(c => `• ${c.name} x${c.qty} = GH₵${c.price*c.qty}`).join('\n');
  const msg = encodeURIComponent(
    `🍽️ *NEW FOOD ORDER — White House Restaurant*\n\n` +
    `*Customer:* ${name || '[Name]'}\n*Phone:* ${phone || '[Phone]'}\n*Address:* ${address || deliveryMode.toUpperCase()}\n*Type:* ${deliveryMode.charAt(0).toUpperCase()+deliveryMode.slice(1)}\n\n` +
    `*Order Details:*\n${itemList || 'No items'}\n\n` +
    `*Subtotal:* GH₵${sub}\n*Delivery:* ${fee>0?'GH₵'+fee:'Free'}\n*Total:* GH₵${grand}\n\n` +
    `${notes ? '*Notes:* ' + notes + '\n\n' : ''}Please confirm this order. 🙏`
  );
  const btn = document.getElementById('whatsapp-order-btn');
  if (btn) btn.href = `https://wa.me/${RESTAURANT_PHONE}?text=${msg}`;
}

function placeOrder() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  if (!name) { showToast('⚠️ Please enter your name.'); return; }
  if (!phone) { showToast('⚠️ Please enter your phone number.'); return; }
  if (deliveryMode === 'delivery' && !address) { showToast('⚠️ Please enter your delivery address.'); return; }
  if (cart.length === 0) { showToast('⚠️ Your cart is empty!'); return; }
  const orderNum = 'WHR-' + Date.now().toString().slice(-6);
  const sub = getSubtotal();
  const fee = deliveryMode === 'delivery' ? DELIVERY_FEE : 0;
  const grand = sub + fee;
  const order = { num: orderNum, name, phone, address, items: [...cart], sub, fee, grand, type: deliveryMode, status: 'Pending', date: new Date().toLocaleDateString('en-GB'), notes: document.getElementById('order-notes').value };
  orders.push(order);
  showReceipt(order);
  cart = [];
  updateCartCount();
  renderCart();
  updateAdminStats();
}

// ======= RECEIPT =======
function showReceipt(order) {
  const modal = document.getElementById('receipt-modal');
  const content = document.getElementById('receipt-content');
  content.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-logo">WHITE HOUSE RESTAURANT<span>Accra, Ghana</span></div>
      <div class="receipt-address">📍 Osu Badu Street, Accra | 📞 +233 24 410 7536</div>
      <div class="receipt-num"># ${order.num}</div>
    </div>
    <div class="receipt-info">
      <div class="receipt-info-item"><div class="ri-label">Date</div><div class="ri-val">${order.date}</div></div>
      <div class="receipt-info-item"><div class="ri-label">Order Type</div><div class="ri-val" style="text-transform:capitalize">${order.type}</div></div>
      <div class="receipt-info-item"><div class="ri-label">Customer</div><div class="ri-val">${order.name}</div></div>
      <div class="receipt-info-item"><div class="ri-label">Phone</div><div class="ri-val">${order.phone}</div></div>
      ${order.type === 'delivery' ? `<div class="receipt-info-item" style="grid-column:1/-1"><div class="ri-label">Delivery Address</div><div class="ri-val">${order.address}</div></div>` : ''}
    </div>
<div class="receipt-items">
       <div class="receipt-items-header"><span>Item</span><span>Qty</span><span>Price</span><span>Total</span></div>
       ${order.items.map(i => {
         const imgSrc = IMAGE_MAP[i.name] ? `menu-images/${IMAGE_MAP[i.name]}` : null;
         const emojiHtml = imgSrc ? `<img src="${imgSrc}" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;">` : (i.emoji || '🍽️');
         return `<div class="receipt-item-row"><span>${emojiHtml} ${i.name}</span><span style="text-align:center">${i.qty}</span><span style="text-align:right">GH₵${i.price}</span><span style="text-align:right;font-weight:600">GH₵${i.price*i.qty}</span></div>`;
       }).join('')}
     </div>
    <div class="receipt-totals">
      <div class="receipt-total-line"><span>Subtotal</span><span>GH₵${order.sub}</span></div>
      <div class="receipt-total-line"><span>Delivery Fee</span><span>${order.fee > 0 ? 'GH₵' + order.fee : 'Free'}</span></div>
      <div class="receipt-total-line grand"><span>Grand Total</span><span class="rv">GH₵${order.grand}</span></div>
    </div>
    <div class="receipt-status"><span class="receipt-status-badge">✅ Order Received</span></div>
    ${order.notes ? `<p style="font-size:0.8rem;color:#6B5A3A;margin:8px 0"><strong>Notes:</strong> ${order.notes}</p>` : ''}
    <div class="receipt-footer">
      <p>Thank you for your order! 🙏</p>
      <p style="margin-top:4px">We'll confirm via WhatsApp shortly.</p>
      <p style="margin-top:4px;color:#C9A84C">White House Restaurant · Osu, Accra</p>
    </div>`;
  const waMsg = encodeURIComponent(`Order # ${order.num} receipt from White House Restaurant — GH₵${order.grand} total.`);
  document.getElementById('wa-receipt-btn').onclick = () => window.open(`https://wa.me/?text=${waMsg}`, '_blank');
  modal.classList.add('open');
}

function closeReceipt() { document.getElementById('receipt-modal').classList.remove('open'); }

function downloadReceipt() {
  const el = document.getElementById('receipt-content');
  html2canvas(el, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
    const a = document.createElement('a');
    a.download = 'WHR-Receipt-' + Date.now() + '.jpg';
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.click();
  });
}

// ======= ADMIN =======
function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('admin-orders').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('admin-menu').style.display = tab === 'menu' ? 'block' : 'none';
  document.getElementById('admin-add-food').style.display = tab === 'add-food' ? 'block' : 'none';
  if (tab === 'menu') renderAdminMenu();
  if (tab === 'orders') renderAdminOrders();
}

function renderAdminOrders() {
  const tbody = document.getElementById('orders-tbody');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px">No orders yet</td></tr>';
    return;
  }
  const statusClasses = { 'Pending':'status-pending','Confirmed':'status-confirmed','Preparing':'status-preparing','Out for Delivery':'status-delivery','Delivered':'status-delivered' };
tbody.innerHTML = orders.map((o, idx) => `
     <tr>
       <td style="font-weight:600;font-size:0.8rem">${o.num}</td>
       <td>${o.name}<br><span style="font-size:0.8rem;color:var(--text-muted)">${o.phone}</span></td>
       <td>${o.items.map(i => {
         const imgSrc = IMAGE_MAP[i.name] ? `menu-images/${IMAGE_MAP[i.name]}` : null;
         return imgSrc ? `<img src="${imgSrc}" style="width:16px;height:16px;vertical-align:middle;">` : (i.emoji || '🍽️');
       }).join('')} <span style="font-size:0.8rem">${o.items.length} item${o.items.length>1?'s':''}</span></td>
       <td style="font-weight:700;color:var(--gold)">GH₵${o.grand}</td>
       <td style="text-transform:capitalize">${o.type}</td>
       <td><span class="status-badge ${statusClasses[o.status]||'status-pending'}">${o.status}</span></td>
       <td>
         <select onchange="updateOrderStatus(${idx},this.value)" style="font-size:0.8rem;padding:4px 8px;border:1px solid var(--border);border-radius:4px;background:var(--white);color:var(--text)">
           ${['Pending','Confirmed','Preparing','Out for Delivery','Delivered'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
         </select>
       </td>
     </tr>`).join('');
}

function updateOrderStatus(idx, status) {
  orders[idx].status = status;
  renderAdminOrders();
  showToast('✅ Order status updated!');
}

function renderAdminMenu() {
  document.getElementById('admin-menu-grid').innerHTML = MENU_DATA.map(i => renderMenuCard(i, true)).join('');
}

function deleteMenuItem(id) {
  const idx = MENU_DATA.findIndex(i => i.id === id);
  if (idx > -1) { MENU_DATA.splice(idx, 1); renderAdminMenu(); showToast('🗑️ Item removed from menu'); }
}

function addNewDish() {
  const name = document.getElementById('new-dish-name').value.trim();
  const cat = document.getElementById('new-dish-cat').value;
  const price = parseFloat(document.getElementById('new-dish-price').value);
  const emoji = document.getElementById('new-dish-emoji').value.trim() || '🍽️';
  const desc = document.getElementById('new-dish-desc').value.trim();
  const badge = document.getElementById('new-dish-tag').value;
  if (!name || !price) { showToast('⚠️ Please fill in name and price.'); return; }
  const newId = Math.max(...MENU_DATA.map(i=>i.id)) + 1;
  MENU_DATA.push({ id: newId, name, cat, price, emoji, desc: desc || 'Freshly prepared dish.', badge: badge || undefined });
  ['new-dish-name','new-dish-price','new-dish-emoji','new-dish-desc'].forEach(id => document.getElementById(id).value = '');
  showToast('✅ ' + name + ' added to menu!');
}

function updateAdminStats() {
  document.getElementById('stat-orders').textContent = orders.length;
  document.getElementById('stat-revenue').textContent = 'GH₵' + orders.reduce((s,o) => s + o.grand, 0);
}

// ======= CONTACT FORM =======
function sendContactForm() {
  const name = document.getElementById('contact-name').value.trim();
  const msg = document.getElementById('contact-message').value.trim();
  if (!name || !msg) { showToast('⚠️ Please fill in name and message.'); return; }
  showToast('✅ Message sent! We\'ll get back to you soon.');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-contact').value = '';
  document.getElementById('contact-message').value = '';
}

// ======= INIT =======
renderHomeMenuGrid();
renderMenuFilters();
renderFullMenu('All');
renderReviews();
renderCheckout();

// Listen for order page checkout input changes
document.addEventListener('input', e => {
  if (['cust-name','cust-phone','cust-address','order-notes'].includes(e.target.id)) {
    updateWhatsAppLink();
    renderCheckout();
  }
});

