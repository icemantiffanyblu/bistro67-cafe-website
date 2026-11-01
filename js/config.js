/* Bistro 67 — content you change per café.
   Everything a café owner would edit lives here: business details and the menu.
   Fields left null show "To be confirmed" on the page instead of invented details. */
window.BISTRO67 = (() => {
'use strict';
/* ===== Business details. Leave null until confirmed; the page says so instead of inventing them. ===== */
const CAFE = {
  city: null,        // e.g. 'Mumbai'
  address: null,     // e.g. 'Shop 67, Example Road, Bandra West, Mumbai 400050'
  mapsUrl: null,     // full Google Maps link
  phone: null,       // e.g. '+91 98xxx xxxxx'
  instagram: null    // e.g. 'bistro67'
};

/* Menu: [name, price in ₹, optional one-line description]. Proposed demo menu. */
const MENU = {
  coffee: ['Coffee', [['Espresso',140],['Americano',170],['Cappuccino',190],['Café Latte',210],['Flat White',220],['Mocha',240],['Spanish Latte',250],['Hazelnut Latte',240],['Caramel Macchiato',260]]],
  house: ['House', [['The 67 Cold Coffee',249,'Thick, cold, hand-whisked.'],['Vietnamese Iced',269,'Slow drip over condensed milk.'],['Tiramisu Latte',289,'Mascarpone foam, cocoa.'],['Salted Caramel Cold Brew',279,'Sixteen-hour brew, sea salt.'],['Biscoff Coffee',299,'Biscoff blended in.'],['Affogato',229,'Gelato, hot double shot.'],['Coconut Cold Brew',269,'Over tender coconut water.']]],
  iced: ['Iced', [['Iced Americano',190,'Two shots over ice.'],['Iced Latte',230,'Espresso, cold milk.'],['Iced Mocha',260,'Dark chocolate, espresso, milk.'],['Cold Brew',220,'Steeped sixteen hours.'],['Vanilla Cold Brew',250,'With a float of vanilla cream.']]],
  coolers: ['Coolers', [['Peach Iced Tea',199,'Black tea, real peach.'],['Passion Fruit Cooler',219,'Tart, fizzy.'],['Watermelon Mint',209,'Watermelon, mint, lime.'],['Blueberry Lemonade',229,'Blueberry, lemon, soda.'],['Classic Mojito',219,'Virgin. Lime, mint, crushed ice.']]],
  bites: ['Kitchen', [['Peri Peri Fries',179,'Our own peri peri.'],['Loaded Nachos',249,'Cheese sauce, salsa, jalapeños.'],['Garlic Bread',189,'Herb butter, mozzarella.'],['Cheese Chilli Toast',199,'Green chilli, too much cheese.'],['Paneer Tikka Sandwich',249,'Tandoori paneer, mint mayo.'],['Pesto Paneer Panini',279,'Pesto, paneer, sun-dried tomato.'],['Veg Club Sandwich',259,'Triple-decker, fries on the side.']]],
  pizza: ['Pizza & Pasta', [['Margherita',299,'Tomato, mozzarella, basil.'],['Farmhouse',369,'Capsicum, onion, mushroom, corn.'],['Paneer Tikka Pizza',389,'Tikka paneer, onion, capsicum.'],['Arrabbiata',319,'Spicy tomato, garlic, penne.'],['Pink Sauce',339,'Half tomato, half cream.'],['Pesto',349,'Basil pesto, parmesan.']]],
  desserts: ['Sweet', [['Tiramisu',279,'Made in-house daily.'],['Biscoff Cheesecake',319,'Baked. Biscoff base and top.'],['Chocolate Brownie',179,'Fudgy. Scoop of vanilla +₹60.'],['New York Cheesecake',299,'Dense, berry compote.'],['Chocolate Croissant',189,'Dark chocolate inside.']]]
};

return { CAFE, MENU };
})();
