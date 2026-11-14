import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Chatbot from './components/Chatbot'
import './menu-groups.css'

const CAFE_WHATSAPP = '923426969696'
const CAFE_EMAIL = 'muzammilshah1st@gmail.com'
const hasActiveLoginToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const payloadPart = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(payloadPart))
    if (payload.exp * 1000 > Date.now()) return true
  } catch {
    // Treat malformed tokens as signed out.
  }
  localStorage.removeItem('token')
  return false
}
const getFoodImageUrl = (image, width = 700) => image.startsWith('http') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=80`
const fallbackImages = {
  'Crispy Chicken': 'photo-1624153064067-566cae78993d',
  Burgers: 'photo-1568901346375-23c9450c58cd',
  Pizza: 'photo-1628840042765-356cda07504e',
  Chinese: 'photo-1603133872878-684f208fb84b',
  Fries: 'photo-1573080496219-bb080dd4f877',
  Milkshakes: 'photo-1572490122747-3968b75cc699',
  'Special Drinks': 'photo-1513558161293-cdaf765edfd7',
  'Cold Drinks': 'photo-1554866585-cd94860890b7',
  'Hot Beverages': 'photo-1544787219-7f47ccb76574',
}

const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Chinese', icon: '🍜' },
  { name: 'Crispy Chicken', icon: '🍗' },
  { name: 'Shawarma', icon: '🌯' },
  { name: 'Rolls', icon: '🫓' },
  { name: 'Food Sandwich', icon: '🥪' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Fries', icon: '🍟' },
  
]

const categoryImages = {
  All: 'photo-1512621776951-a57141f2eefd',
  Burgers: 'photo-1568901346375-23c9450c58cd',
  Pizza: 'photo-1628840042765-356cda07504e',
  Chinese: 'photo-1603133872878-684f208fb84b',
  'Crispy Chicken': 'photo-1624153064067-566cae78993d',
  Shawarma: 'https://assets.indolj.io/upload/1666878045-1%20%2839%29.jpg',
  Rolls: 'https://assets.indolj.io/upload/1729840743-Malai-Boti-Roll.jpg',
  'Food Sandwich': 'https://www.barista.co.in/sites/default/files/2024-08/Chicken%20Sandwich.webp',
  Pasta: 'photo-1473093295043-cdd812d0e601',
  Fries: 'photo-1573080496219-bb080dd4f877',
}

const desiCategories = [
  { name: 'Barbecue', image: 'https://images.deliveryhero.io/image/fd-pk/Products/70735281.jpg?width=700' },
  { name: 'Karahi', image: 'https://images.deliveryhero.io/image/fd-pk/products/3502756.jpg?width=700' },
  { name: 'Fish', image: 'https://images.deliveryhero.io/image/fd-pk/Products/75596521.jpg?width=700' },
  { name: 'Biryani and Pulao', image: 'https://assets.indolj.io/upload/1729841848-Biryani-Single.jpg' },
]

const beverageCategories = [
  { name: 'Milkshakes', image: 'https://cdn.uengage.io/uploads/32975/image-5789-1776674101.jpg' },
  { name: 'Special Drinks', image: 'https://www.foodonfire.in/assets/menu/optimized/food-on-fire-warangal-mocktail-02.webp' },
  { name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80' },
  { name: 'Hot Beverages', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80' },
]

const specialPizzaSizes = { Small: 750, Medium: 1350, Large: 1600, 'Extra Large': 2200 }
const normalPizzaSizes = { Small: 700, Medium: 1250, Large: 1500, 'Extra Large': 2000 }
const pizzaImages = {
  'Special Student Cafe Pizza': 'https://images.deliveryhero.io/image/global-menu-service/GV_IT/vendor/846713/product/d551cb77-0039-4d0f-8c70-ce942fa912be.jpg',
  'Crown Crust Pizza': 'https://images.deliveryhero.io/image/fd-pk/LH/z04u-listing.jpg',
  'Kebab Crust Pizza': 'photo-1571407970349-bc81e7e96d47',
  'Kababish Special Pizza': 'photo-1574071318508-1cdbab80d002',
  'Cheese Crust Pizza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cheese_pizza_with_seafood.jpg/1280px-Cheese_pizza_with_seafood.jpg',
  'Bihari Pizza': 'https://lhr.greenvalley.pk/cdn/shop/files/tikka-pizza.webp?v=1754900314&width=900',
  'Four Flavor Pizza': 'https://images.deliveryhero.io/image/global-menu-service/GV_IT/vendor/846713/product/d551cb77-0039-4d0f-8c70-ce942fa912be.jpg',
  'Chicken Tikka Pizza': 'https://lhr.greenvalley.pk/cdn/shop/files/tikka-pizza.webp?v=1754900314&width=900',
  'Chicken Fajita Pizza': 'photo-1604382354936-07c5d9983bd3',
  'Chicken Supreme Pizza': 'photo-1579751626657-72bc17010498',
  'Chicken Italian Pizza': 'photo-1593560708920-61dd98c46a4e',
  'Beef Tikka Pizza': 'photo-1571407970349-bc81e7e96d47',
  'Barbecue Pizza': 'photo-1574071318508-1cdbab80d002',
  'Pineapple Pizza': 'photo-1513104890138-7c749659a591',
  'Calzone Pizza': 'https://images.unsplash.com/photo-1641244999574-5afea228bd26?auto=format&fit=crop&w=1000&q=85',
}
const makePizza = (name, section, sizes) => ({
  name,
  category: 'Pizza',
  section,
  description: `${name}, freshly made to order. Choose your size.`,
  sizes,
  amount: Object.values(sizes)[0],
  price: `Rs. ${Object.values(sizes)[0]}`,
  tag: section === 'Special Flavors' ? 'Special flavor' : 'Classic flavor',
  image: pizzaImages[name],
})

const pizzaMenuItems = [
  ...['Special Student Cafe Pizza', 'Crown Crust Pizza', 'Kebab Crust Pizza', 'Kababish Special Pizza', 'Cheese Crust Pizza', 'Bihari Pizza', 'Four Flavor Pizza'].map((name) => makePizza(name, 'Special Flavors', specialPizzaSizes)),
  ...['Chicken Tikka Pizza', 'Chicken Fajita Pizza', 'Chicken Supreme Pizza', 'Chicken Italian Pizza', 'Beef Tikka Pizza', 'Barbecue Pizza', 'Pineapple Pizza', 'Calzone Pizza'].map((name) => makePizza(name, 'Normal Flavors', normalPizzaSizes)),
]

const chineseMenuItems = [
  { name: 'Chicken Chilli Dry with Fried Rice', description: 'Spicy chicken chilli dry served with fried rice.', price: 'Rs. 600', amount: 600, tag: 'Spicy favourite', image: 'https://foodfusion.com/wp-content/uploads/2022/08/ID-R02281-Chicken-Chilli-Dry-with-Fried-Rice.00_03_04_22.Still003.jpg?v=1663583066' },
  { name: 'Beef Chilli Dry with Fried Rice', description: 'Beef chilli dry with a side of fried rice.', price: 'Rs. 700', amount: 700, tag: 'Wok favourite', image: 'https://img-global.cpcdn.com/recipes/acd744b0107e7d54/680x781cq80/beef-chilli-dry-with-fried-rice-recipe-main-photo.jpg' },
  { name: 'Chicken Manchurian with Rice', description: 'Chicken Manchurian served with rice.', price: 'Rs. 650', amount: 650, tag: 'Saucy & savoury', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97947244.jpg' },
  { name: 'Chicken Shashlik with Rice', description: 'Chicken shashlik served with rice.', price: 'Rs. 650', amount: 650, tag: 'Campus classic', image: 'https://bbqtonight.com/menu/Food%20Pics/BBQSpecialities/Shashlik.jpg' },
  { name: 'Chicken Fried Rice', description: 'Wok-fried rice with chicken.', price: 'Rs. 550', amount: 550, tag: 'Wok tossed', image: 'https://images.deliveryhero.io/image/fd-pk/Products/5659596.jpg?height=393.75&width=393.75' },
  { name: 'Egg Fried Rice', description: 'Egg tossed with freshly cooked rice.', price: 'Rs. 450', amount: 450, tag: 'Simple & tasty', image: 'https://images.deliveryhero.io/image/fd-pk/products/11167793.jpg' },
  { name: 'Vegetable Fried Rice', description: 'Wok-fried rice with vegetables.', price: 'Rs. 450', amount: 450, tag: 'Veg favourite', image: 'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/veg_fried_rice.jpg' },
  { name: 'Chicken Chow Mein', description: 'Chicken and noodles tossed in a savoury sauce.', price: 'Rs. 600', amount: 600, tag: 'Noodle bowl', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97862664.jpg' },
  { name: 'Alfredo Pasta', description: 'Creamy Alfredo pasta, made for a proper comfort-food break.', price: 'Rs. 800', amount: 800, tag: 'Creamy comfort', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97641468.jpg' },
  { name: 'Lasagna', description: 'Layers of pasta, sauce and cheese, baked until golden.', price: 'Rs. 800', amount: 800, tag: 'Baked favourite', image: 'photo-1574894709920-11b28e7367e3' },
].map((item) => ({ ...item, category: 'Chinese' }))

const crispyChickenMenuItems = [
  { name: 'Crispy Chicken · 1 × 1/8 Piece', description: 'One golden, crunchy 1/8 chicken piece.', price: 'Rs. 250', amount: 250, tag: 'Single piece', image: 'https://images.deliveryhero.io/image/fd-pk/products/8807255.jpg' },
  { name: 'Crispy Chicken · 5 × 1/8 Pieces', description: 'Five crispy 1/8 chicken pieces, made to share.', price: 'Rs. 1,200', amount: 1200, tag: 'Five-piece deal', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80' },
  { name: 'Crispy Chicken Wings · 5 Pieces', description: 'Five crunchy, golden chicken wings.', price: 'Rs. 400', amount: 400, tag: 'Crispy wings', image: 'https://www.mashed.com/img/gallery/why-chicken-wings-always-taste-better-at-a-restaurant/restaurants-use-special-breading-techniques-1727291737.jpg' },
  { name: 'Crispy Chicken Wings · 10 Pieces', description: 'Ten crispy wings for a bigger craving.', price: 'Rs. 750', amount: 750, tag: 'Wing share box', image: 'https://betterresto.s3.us-west-1.wasabisys.com/production/13280/2024_12_09_21_33_15_009_7f88ca690d.jpg' },
  { name: 'Fried Masala Wings · 5 Pieces', description: 'Five fried wings with a bold masala coating.', price: 'Rs. 350', amount: 350, tag: 'Masala kick', image: 'https://images.unsplash.com/photo-1624153064067-566cae78993d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Fried Masala Wings · 10 Pieces', description: 'Ten masala-seasoned wings, fried until crispy.', price: 'Rs. 650', amount: 650, tag: 'Extra masala', image: 'https://cdn1.site-media.eu/images/576%2C2177x1982%2B672%2B0/6484265/HotWings.jpg' },
  { name: 'Crispy Chicken Bites · 5 Pieces', description: 'Five bite-sized pieces of crunchy chicken.', price: 'Rs. 300', amount: 300, tag: 'Crispy bites', image: 'https://cdn3.didevelop.com/public/cdn/533_701ced8b2084a251d16668fb9b678699.jpeg' },
  { name: 'Crispy Chicken Bites · 10 Pieces', description: 'Ten crispy chicken bites, perfect for sharing.', price: 'Rs. 550', amount: 550, tag: 'Bite-size share box', image: 'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/wings_n_more_boneless_bites.jpg' },
  { name: 'Chicken Nuggets · 5 Pieces', description: 'Five golden chicken nuggets with a crunchy bite.', price: 'Rs. 250', amount: 250, tag: 'Nugget favourite', image: 'https://zingncrisp.pk/assets/images/chicken-wings/five-nuggets.png' },
  { name: 'Chicken Nuggets · 10 Pieces', description: 'Ten crispy chicken nuggets for sharing.', price: 'Rs. 500', amount: 500, tag: 'Ten-piece box', image: 'https://zingncrisp.pk/assets/images/chicken-wings/ten-nuggets.png' },
].map((item) => ({ ...item, category: 'Crispy Chicken' }))

const shawarmaMenuItems = [
  { name: 'Special Turkish Chicken Grilled Wrap', description: 'Turkish-style grilled chicken wrapped fresh to order.', price: 'Rs. 450', amount: 450, tag: 'Grilled wrap', image: 'https://images.deliveryhero.io/image/fd-pk/Products/40944431.jpg' },
  { name: 'Special Arabic Beef Grilled Wrap', description: 'Arabic-style grilled beef in a warm wrap.', price: 'Rs. 450', amount: 450, tag: 'Beef wrap', image: 'https://images.deliveryhero.io/image/fd-pk/products/32004301.jpg?height=393.75&width=393.75' },
  { name: 'Barbecue Chicken Wrap', description: 'Grilled chicken wrapped with a smoky barbecue flavor.', price: 'Rs. 500', amount: 500, tag: 'BBQ chicken', image: 'https://ozfoodhunter.com.au/resources/upload_files/dish_logo/9152/dish_logo_503811.jpg' },
  { name: 'Barbecue Beef Wrap', description: 'Grilled beef and barbecue flavor wrapped up fresh.', price: 'Rs. 550', amount: 550, tag: 'BBQ beef', image: 'https://images.deliveryhero.io/image/fd-cz/Products/59144428.jpg' },
  { name: 'Chicken Tikka Shawarma', description: 'Chicken tikka rolled in a soft shawarma wrap.', price: 'Rs. 180', amount: 180, tag: 'Tikka shawarma', image: 'https://images.deliveryhero.io/image/fd-pk/products/3513512.jpg' },
  { name: 'Chicken Cheese Shawarma', description: 'Chicken shawarma with melted cheese in a warm wrap.', price: 'Rs. 250', amount: 250, tag: 'Cheesy chicken', image: 'https://images.deliveryhero.io/image/fd-pk/Products/31059950.jpg' },
  { name: 'Beef Tikka Shawarma', description: 'Beef tikka wrapped fresh for a hearty bite.', price: 'Rs. 350', amount: 350, tag: 'Beef tikka', image: 'https://allbahria.com/storage/products/680a694118abb1745512769.jpeg' },
  { name: 'Beef Chicken Shawarma', description: 'A mixed beef and chicken shawarma wrap.', price: 'Rs. 400', amount: 400, tag: 'Mixed shawarma', image: 'https://static-content.owner.com/funnel/images/f795df73-20a6-4979-87fd-031fd985c6d7.jpg?auto=format&q=80&v=5105567663' },
  { name: 'Zinger Shawarma', description: 'Crispy zinger chicken rolled in a shawarma wrap.', price: 'Rs. 350', amount: 350, tag: 'Crispy zinger', image: 'https://assets.indolj.io/upload/1666878045-1%20%2839%29.jpg' },
  { name: 'Zinger Cheese Shawarma', description: 'Crispy zinger chicken with cheese in a warm wrap.', price: 'Rs. 420', amount: 420, tag: 'Zinger & cheese', image: 'https://images.deliveryhero.io/image/fd-pk/LH/fi2o-listing.jpg' },
  { name: 'Chicken Platter Shawarma', description: 'Chicken shawarma served as a generous platter.', price: 'Rs. 500', amount: 500, tag: 'Chicken platter', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/92bb4c106722593.5f96d2bec8f9c.jpg' },
  { name: 'Beef Platter Shawarma', description: 'Beef shawarma served as a generous platter.', price: 'Rs. 600', amount: 600, tag: 'Beef platter', image: 'https://tastesilkroad.com/pluto-images/funnel/images/6e72c3d9-0636-44aa-afe7-ea7c956a6cb7?fit=cover&w=1920' },
].map((item) => ({ ...item, category: 'Shawarma' }))

const rollsMenuItems = [
  { name: 'Malai Boti Paratha Roll', description: 'Creamy, spiced malai boti wrapped in flaky paratha.', price: 'Rs. 300', amount: 300, tag: 'Malai boti', image: 'https://assets.indolj.io/upload/1729840743-Malai-Boti-Roll.jpg' },
  { name: 'Chicken Boti Paratha Roll', description: 'Grilled chicken boti wrapped in warm paratha.', price: 'Rs. 280', amount: 280, tag: 'Chicken boti', image: 'https://nabeelafoodhub.com/wp-content/uploads/2024/03/paratha-roll-500x500.jpeg' },
  { name: 'Kebab Paratha Roll', description: 'A savory kebab rolled in flaky paratha.', price: 'Rs. 280', amount: 280, tag: 'Kebab roll', image: 'https://hamariweb.com/recipes/images/recipeimages/71072.jpg' },
  { name: 'Single Paratha Roll', description: 'A classic single paratha roll, made fresh.', price: 'Rs. 400', amount: 400, tag: 'Classic roll', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97606582.jpg' },
  { name: 'Chicken Paratha Roll', description: 'Tender spiced chicken wrapped in golden paratha.', price: 'Rs. 280', amount: 280, tag: 'Chicken roll', image: 'https://images.deliveryhero.io/image/fd-pk/LH/n4ca-listing.jpg' },
  { name: 'Chicken Cheese Paratha Roll', description: 'Spiced chicken and melted cheese in flaky paratha.', price: 'Rs. 350', amount: 350, tag: 'Chicken & cheese', image: 'https://images.deliveryhero.io/image/fd-pk/products/7338277.jpg' },
  { name: 'Beef Paratha Roll', description: 'Spiced beef boti wrapped in golden paratha.', price: 'Rs. 300', amount: 300, tag: 'Beef roll', image: 'https://images.deliveryhero.io/image/fd-pk/products/42508272.jpg' },
  { name: 'Beef Cheese Paratha Roll', description: 'Seasoned beef and melted cheese wrapped in paratha.', price: 'Rs. 400', amount: 400, tag: 'Beef & cheese', image: 'https://assets.indolj.io/upload/1765523614-Beef-Cheese-Roll.webp' },
  { name: 'Fries Roll', description: 'Crispy fries tucked into a warm paratha roll.', price: 'Rs. 250', amount: 250, tag: 'Fries roll', image: 'https://wisermap.com/business/photos/7eOr1Q3MUYX8k8yLyH2mk0cBWaymzAStzAonz65x.webp' },
].map((item) => ({ ...item, category: 'Rolls' }))

const sandwichMenuItems = [
  { name: 'Chicken Sandwich', description: 'A fresh chicken sandwich made for a satisfying quick bite.', price: 'Rs. 280', amount: 280, tag: 'Chicken favourite', image: 'https://www.barista.co.in/sites/default/files/2024-08/Chicken%20Sandwich.webp' },
  { name: 'Club Sandwich', description: 'A hearty, layered club sandwich toasted fresh.', price: 'Rs. 300', amount: 300, tag: 'Layered classic', image: 'https://www.tastingtable.com/img/gallery/what-sets-a-pakistani-club-sandwich-apart-from-the-american-version/l-intro-1712267295.jpg' },
  { name: 'Tikka Sandwich', description: 'A sandwich filled with spicy chicken tikka.', price: 'Rs. 320', amount: 320, tag: 'Desi favourite', image: 'https://greenvalley.pk/cdn/shop/files/Greenvalley-Chicken-Tikka-Sandwich_5c1670ad-43b2-4165-a155-43a23261bfea.webp?v=1741076560' },
  { name: 'Fajita Sandwich', description: 'Chicken fajita filling tucked into toasted bread.', price: 'Rs. 320', amount: 320, tag: 'Fajita flavour', image: 'photo-1528735602780-2552fd46c7af' },
  { name: 'Grilled Sandwich', description: 'A golden grilled sandwich, served warm and crisp.', price: 'Rs. 350', amount: 350, tag: 'Grilled fresh', image: 'https://citysearch.pk/uf/albums/12525/qadir-burger45.jpg' },
  { name: 'Vegetable Sandwich', description: 'A light sandwich filled with fresh vegetables.', price: 'Rs. 250', amount: 250, tag: 'Vegetarian', image: 'photo-1525351484163-7529414344d8' },
].map((item) => ({ ...item, category: 'Food Sandwich' }))

const pastaMenuItems = [
  { name: 'Chicken Pizza Pasta', description: 'Creamy chicken pasta with a pizza-inspired, cheesy finish.', category: 'Pasta', sizes: { Small: 450, Large: 850 }, amount: 450, price: 'Rs. 450', tag: 'Chicken & cheese', image: 'https://images.deliveryhero.io/image/fd-pk/Products/93330815.jpg?width=700' },
  { name: 'Malai Boti Pizza Pasta', description: 'Pizza-style pasta with creamy malai boti chicken.', category: 'Pasta', sizes: { Small: 480, Large: 900 }, amount: 480, price: 'Rs. 480', tag: 'Malai boti', image: 'photo-1473093295043-cdd812d0e601' },
  { name: 'Crispy Zinger Pizza Pasta', description: 'Cheesy pizza pasta topped with crispy zinger chicken.', category: 'Pasta', sizes: { Small: 480, Large: 900 }, amount: 480, price: 'Rs. 480', tag: 'Crispy zinger', image: 'photo-1555949258-eb67b1ef0e7e' },
]

const menuItems = [
  { name: 'Tandoori Burger', category: 'Burgers', description: 'A flavourful tandoori-style burger.', price: 'Rs. 500', amount: 500, tag: 'Tandoori favourite', image: 'https://fumba.store/cdn/shop/files/8k-ultra-realistic-image-of-chicken-tikka-burger.png?v=1778493652' },
  { name: 'Special Surprise Burger', category: 'Burgers', description: 'Chicken fillet, beef patty, cheese, jalapeño & fries.', price: 'Rs. 600', amount: 600, tag: 'The big surprise', image: 'https://images.deliveryhero.io/image/fd-pk/Products/72325026.jpg' },
  { name: 'Special Volcano Burger', category: 'Burgers', description: 'Beef patty or chicken fillet with a cheese block & fries.', price: 'Rs. 600', amount: 600, tag: 'Big & cheesy', image: 'https://images.deliveryhero.io/image/fd-pk/products/52609636.jpg' },
  { name: 'Special Student Burger', category: 'Burgers', description: 'Zinger chicken patty, cheese & fries.', price: 'Rs. 600', amount: 600, tag: 'Student special', image: 'https://images.deliveryhero.io/image/fd-pk/products/97917115.jpg' },
  { name: 'Double Tower Grill Burger', category: 'Burgers', description: 'Double chicken fillet or beef patty, cheese, special sauces, jalapeño & fries.', price: 'Rs. 600', amount: 600, tag: 'Double tower', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97899482.jpg' },
  { name: 'Double Decker Zinger Burger', category: 'Burgers', description: 'Double Zinger, cheese & fries.', price: 'Rs. 700', amount: 700, tag: 'Double stack', image: 'https://images.deliveryhero.io/image/fd-pk/products/4239826.jpg' },
  { name: 'Zinger Burger', category: 'Burgers', description: 'Crispy Zinger with real creamy mayo.', price: 'Rs. 450', amount: 450, tag: 'Crispy favourite', image: 'https://images.deliveryhero.io/image/fd-pk/products/38687710.jpg' },
  { name: 'Chicken Grill Burger', category: 'Burgers', description: 'Chicken fillet with special mayo sauce.', price: 'Rs. 450', amount: 450, tag: 'Grill favourite', image: 'https://images.deliveryhero.io/image/fd-pk/LH/q0ao-listing.jpg' },
  { name: 'Beef Grill Burger', category: 'Burgers', description: 'Beef patty with jalapeño & special barbecue sauce.', price: 'Rs. 500', amount: 500, tag: 'Smoky & savoury', image: 'https://images.deliveryhero.io/image/fd-pk/products/37932854.jpg' },
  { name: 'Chicken Tikka Burger', category: 'Burgers', description: 'Chicken tikka with jalapeño & peri-peri sauce.', price: 'Rs. 320', amount: 320, tag: 'Tikka with a kick', image: 'https://fumba.store/cdn/shop/files/8k-ultra-realistic-image-of-chicken-tikka-burger.png?v=1778493652' },
  { name: 'Chicken Patty Burger', category: 'Burgers', description: 'Chicken patty with special burger mayo.', price: 'Rs. 300', amount: 300, tag: 'Easy favourite', image: 'https://images.deliveryhero.io/image/fd-pk/products/6825700.jpg' },
  { name: 'Fish Burger', category: 'Burgers', description: 'A tasty fish burger, freshly made to order.', price: 'Rs. 600', amount: 600, tag: 'Fresh catch', image: 'https://16a9564f-f8ec-42ba-a998-3027aa809e50.selstorage.ru/restoran-metiko/70588/images/items/e1117dfb4071a8970a405d740538a1af.JPEG' },
  { name: 'Shami Burger', category: 'Burgers', description: 'A classic shami burger, freshly made to order.', price: 'Rs. 180', amount: 180, tag: 'Classic bite', image: 'photo-1550547660-d9450f859349' },
  { name: 'Campus Smash', category: 'Burgers', description: 'Double smashed beef, cheddar, pickles & house sauce.', price: 'Rs. 650', amount: 650, tag: 'Student fave', image: 'photo-1568901346375-23c9450c58cd' },
  { name: 'Crispy Chick', category: 'Burgers', description: 'Crispy chicken, slaw, spicy mayo & a soft brioche bun.', price: 'Rs. 590', amount: 590, tag: 'A little spicy', image: 'photo-1606755962773-d324e0a13086' },
  ...pizzaMenuItems,
  ...chineseMenuItems,
  ...crispyChickenMenuItems,
  ...shawarmaMenuItems,
  ...rollsMenuItems,
  ...sandwichMenuItems,
  ...pastaMenuItems,
  { name: 'Regular Fries', category: 'Fries', description: 'Classic golden fries, freshly fried and lightly salted.', price: 'Rs. 200', amount: 200, tag: 'Classic side', image: 'photo-1573080496219-bb080dd4f877' },
  { name: 'Family Fries', category: 'Fries', description: 'A generous shareable serving of golden fries.', price: 'Rs. 350', amount: 350, tag: 'Shareable serving', image: 'https://www.het-eethuis.nl/images/productwebp/8bc19b0eb167bc3ca60a0c3eed850dadd2332b84.webp' },
  { name: 'Crispy Masala Fries', category: 'Fries', description: 'Crispy fries tossed in a flavourful masala seasoning.', price: 'Rs. 400', amount: 400, tag: 'Masala kick', image: 'https://www.currycabin.ca/img/menu/starter/veg/masala-fries.jpg' },
  { name: 'Zinger Mayo Loaded Fries', category: 'Fries', description: 'Golden fries loaded with crispy zinger chicken and creamy mayo.', price: 'Rs. 600', amount: 600, tag: 'Loaded favourite', image: 'https://rizzma.at/img/chickenFries2.jpg' },
  { name: 'Iced Mocha', category: 'Drinks', description: 'Cold brew, chocolate & creamy milk over plenty of ice.', price: 'Rs. 320', amount: 320, tag: 'Keep going', image: 'photo-1461023058943-07fcbe16d735' },
  { name: 'Choco Cookie Skillet', category: 'Desserts', description: 'Warm chocolate cookie, baked fresh and made for sharing.', price: 'Rs. 420', amount: 420, tag: 'Sweet finish', image: 'photo-1499636136210-6f4ee915583e' },
]

const barbecueMenuItems = [
  { name: 'Chicken Chest Piece', description: 'One char-grilled chicken chest piece.', amount: 350, image: 'https://images.deliveryhero.io/image/fd-pk/products/73815284.jpg' },
  { name: 'Chicken Leg Piece', description: 'One traditional Pakistani-style grilled chicken leg piece.', amount: 300, image: 'https://images.deliveryhero.io/image/fd-pk/products/47634038.jpg' },
  { name: 'Malai Boti · 1 Plate', description: 'One plate of creamy, char-grilled chicken malai boti.', amount: 300, image: 'https://assets.indolj.io/upload/1729842564-Malai-Boti.jpg' },
  { name: 'Chicken Boti · 1 Plate', description: 'One plate of spiced chicken boti grilled over charcoal.', amount: 280, image: 'https://talhabbqandfastfood.businesswala.pk/assets/uploads/0abffab7f2aac2720331b469c34cf56f.png' },
  { name: 'Afghani Tikka · 1 Plate', description: 'One plate of creamy Afghani-style chicken tikka.', amount: 600, image: 'https://images.deliveryhero.io/image/fd-pk/Products/97547904.jpg?height=700&width=700' },
  { name: 'Beef Tikka · 1 Plate', description: 'One plate of charcoal-grilled beef tikka.', amount: 560, image: 'https://hamariweb.com/recipes/images/recipeimages/3328.jpg' },
  { name: 'Chicken Reshmi Kebab · 1 Plate (4 Pieces)', description: 'One plate with four tender chicken reshmi kebabs.', amount: 520, image: 'https://nafeesstorage.s3.amazonaws.com/product/wzGKAl57JaJD9ExsAQZlMIA3UoYWlPS6LDYmwSDC.jpg' },
  { name: 'Beef Kebab · 1 Plate (4 Pieces)', description: 'One plate with four grilled beef kebabs.', amount: 600, image: 'https://static3.webx.pk/files/67420/Images/beef-seekh-kbaba-67420-0-180723091547554.png' },
  { name: 'Gola Kebab · 1 Plate (6 Pieces)', description: 'One plate with six charcoal-grilled gola kebabs.', amount: 600, image: 'https://www.pakistangrocery.com/image/cache/data/grocery/Gola-Kabab-from-menu-505x555.jpg' },
  { name: 'Full Chicken Angara', description: 'One full chicken, marinated and grilled Angara-style.', amount: 1300, image: 'https://raheemevents.com/images/menu/raheem_food_images/BBQ/027_Chicken%20Chargha.webp' },
  { name: 'Full Chicken Sajji', description: 'One full Balochi-style chicken sajji.', amount: 1300, image: 'https://images.deliveryhero.io/image/fd-pk/products/12632736.jpg?height=700&width=700' },
  { name: 'Bateer · 1 Piece', description: 'One grilled bateer (quail).', amount: 250, image: 'https://assets.indolj.io/upload/1693760197-Bataira%20Barbeque.jpg' },
  { name: 'Mutton Tikka Seekh · 1 kg', description: 'One kilogram of grilled mutton tikka seekh.', amount: 3200, image: 'https://assets.tendercuts.in/product/M/R/4e4dd57c-d7d8-410f-82d5-08136d15d285.jpg' },
  { name: 'Steam Beef Chaamp · 1 kg', description: 'One kilogram of steamed beef chaamp.', amount: 2000, image: 'https://www.pak101.com/recipes/Beef/2017/3/13/Beef_Steam_Roast_recipe_ecqqz_Pak101%28dot%29com.jpg' },
].map((item) => ({ ...item, category: 'Barbecue', tag: 'Pakistani BBQ', price: `Rs. ${item.amount}` }))

const makeDesiSizedItem = (name, sizes, image, description) => ({
  name,
  category: 'Karahi',
  description,
  sizes,
  amount: Object.values(sizes)[0],
  price: `Rs. ${Object.values(sizes)[0]}`,
  tag: 'Pakistani favourite',
  image,
})

const karahiMenuItems = [
  makeDesiSizedItem('Chicken Karahi', { Full: 1600, Half: 850 }, 'https://images.deliveryhero.io/image/fd-pk/products/3502756.jpg?width=700', 'Traditional chicken karahi, cooked in a rich Pakistani masala.'),
  makeDesiSizedItem('Chicken Soleimani Karahi', { Full: 1600, Half: 850 }, 'https://images.deliveryhero.io/image/fd-pk/LH/v2rd-hero.jpg?width=700', 'Soleimani-style chicken karahi, prepared with bold spices.'),
  makeDesiSizedItem('Chicken Achari Karahi', { Full: 1700, Half: 900 }, 'https://www.alishansajji.pk/img/Chicken_Achari_Boneless.webp', 'Tangy chicken karahi with achari spices.'),
  makeDesiSizedItem('Chicken Boneless Handi', { Full: 1900, Half: 1000 }, 'https://humenglish341f88e60e.blob.core.windows.net/humenglish/masala_tv/uploads/2014/06/F2EXRPPHYJY64C5.MEDIUM.jpg', 'Boneless chicken simmered in a creamy handi gravy.'),
  makeDesiSizedItem('Chicken Jalfrezi', { Full: 1900, Half: 1000 }, 'https://theyummydelights.com/wp-content/uploads/2025/06/chicken-jalfrezi-curry-recipe.jpg', 'Chicken jalfrezi cooked with peppers in a spiced sauce.'),
  makeDesiSizedItem('Chicken Achari Handi', { Full: 2000, Half: 1100 }, 'https://static.tossdown.com/images/a81c4e31-5c3e-4d76-9b1f-86293ba1f96a.jpg', 'Chicken handi with tangy achari masala.'),
  makeDesiSizedItem('Chicken Makai Handi', { Full: 2400, Half: 1250 }, 'https://s2.dmcdn.net/v/TKDiD1XP_Nui7KQTr/x1080', 'Chicken handi with sweet corn and spices.'),
  makeDesiSizedItem('Beef Karahi', { Full: 2000, Half: 1100 }, 'https://img-global.cpcdn.com/recipes/e6919c5ae4cc2018/680x781cq80/beef-karahi-recipe-main-photo.jpg', 'Beef pieces cooked in a traditional tomato and spice karahi.'),
  makeDesiSizedItem('Beef Achari Karahi', { Full: 2000, Half: 1100 }, 'https://img-global.cpcdn.com/recipes/1b56e0248a2d9ff6/680x482cq70/beef-achari-karhai-recipe-main-photo.jpg', 'Beef karahi with a tangy achari spice blend.'),
  makeDesiSizedItem('Chicken White Karahi', { Full: 1800, Half: 950 }, 'https://humenglish341f88e60e.blob.core.windows.net/humenglish/masala_tv/uploads/2014/06/F2EXRPPHYJY64C5.MEDIUM.jpg', 'Creamy white chicken karahi, served in traditional style.'),
  { name: 'Beef Karahi · 1 Plate', category: 'Karahi', description: 'One plate of Pakistani-style beef karahi.', amount: 400, price: 'Rs. 400', tag: 'Single plate', image: 'https://humenglish341f88e60e.blob.core.windows.net/humenglish/masala_tv/uploads/2019/03/1.jpg' },
  { name: 'Achar Gosht · 1 Plate', category: 'Karahi', description: 'One plate of spicy achar gosht.', amount: 450, price: 'Rs. 450', tag: 'Single plate', image: 'https://dhakabhayyabiryani.com/pictures/Beef%20Achari%20Karahi.jpg' },
  makeDesiSizedItem('Full Chicken Roast', { Full: 1300, Half: 700 }, 'https://raheemevents.com/images/menu/raheem_food_images/BBQ/027_Chicken%20Chargha.webp', 'Roasted chicken, available whole or half.'),
  makeDesiSizedItem('Shinwari Mutton Karahi', { '1 kg': 3600, 'Half kg': 1900 }, 'https://static2.menufyy.com/hazro-shinwari-tikka-house-menu-highlight-8.jpg', 'Shinwari mutton karahi, available by the kilogram or half kilogram.'),
]

const fishMenuItems = [
  { name: 'Kalarhu Fish', category: 'Fish', description: 'Pakistani-style spiced fried Kalarhu fish.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://foodiespakistan.pk/_next/image/?q=85&url=https%3A%2F%2Fcdn.foodiespakistan.pk%2Fuploads%2Fsiddiqui-tikka-shop-fish-hakDeTkA.webp&w=1200' },
  { name: 'Mahseer Fish', category: 'Fish', description: 'Spiced fish steaks fried Pakistani-style.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://www.qatar-tribune.com/watanqatartribune/uploads/images/2022/08/10/18736.jpg' },
  { name: 'Silver Fish', category: 'Fish', description: 'Crispy fried silver fish with a golden spice coating.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://bonapeti.com/files/1200x800/parjen-tolstolob-chesan.webp' },
  { name: 'Simon Fish', category: 'Fish', description: 'Spiced fried Simon fish, served hot.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://images.squarespace-cdn.com/content/v1/6633a679bde95f1b843338a3/1719865767544-NHJ5ML5ZVIYVGGPWUJ7Q/sff.jpeg?format=2500w' },
  { name: 'Mili Fish', category: 'Fish', description: 'Traditional Pakistani-style fried Mili fish.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://1.bp.blogspot.com/-cqeTW64TBno/Xj_4-wghGwI/AAAAAAAAXxs/YbdE-bebI3soYpZDOQcjBXg4GozuF0HHACLcBGAsYHQ/s640-rw/lahori-fish-2.jpg' },
  { name: 'Til Fish', category: 'Fish', description: 'Crispy fried tilapia fish with a spiced coating.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://savoyrestauranthouston.com/wp-content/uploads/2023/05/Tilpiya-Fry.jpg' },
  { name: 'Finger Fish', category: 'Fish', description: 'Golden, crispy fish fingers served with a dipping sauce.', amount: 500, price: 'Rs. 500', tag: 'Fish', image: 'https://images.deliveryhero.io/image/fd-pk/Products/75596521.jpg?width=700' },
]

const beverageMenuItems = [
  { name: 'Apple Milkshake', category: 'Milkshakes', description: 'Creamy apple milkshake blended fresh.', amount: 300, image: 'https://cdn.uengage.io/uploads/32975/image-2918-1769442032.jpg' },
  { name: 'Banana Milkshake', category: 'Milkshakes', description: 'Smooth banana milkshake made with ripe bananas.', amount: 300, image: 'https://cdn.uengage.io/uploads/32975/image-5789-1776674101.jpg' },
  { name: 'Mango Milkshake', category: 'Milkshakes', description: 'A chilled, creamy mango milkshake.', amount: 300, image: 'https://images.deliveryhero.io/image/fd-pk/products/12899059.jpg?width=700' },
  { name: 'Strawberry Milkshake', category: 'Milkshakes', description: 'Sweet strawberry blended into a creamy shake.', amount: 400, image: 'https://images.deliveryhero.io/image/fd-pk/products/18383590.jpg?width=700' },
  { name: 'Date Milkshake', category: 'Milkshakes', description: 'A rich milkshake blended with sweet dates.', amount: 350, image: 'https://images.deliveryhero.io/image/talabat/MenuItems/Dates_Milk_Shake638930237847972985.jpg' },
  { name: 'Pineapple Milkshake', category: 'Milkshakes', description: 'Creamy pineapple milkshake with a tropical taste.', amount: 400, image: 'https://static.langimg.com/nbt/thumb/84789130/pineapple-and-milk-combination-can-be-dangerous-as-per-ayurveda.jpg?height=900&imgsize=83310&resizemode=75&width=1600' },
  { name: 'Chocolate Milkshake', category: 'Milkshakes', description: 'Classic chocolate shake, chilled and creamy.', amount: 400, image: 'https://lessaveursdematante.com/cdn/shop/files/f7b9f6f9-1837-49e6-9333-08b92508031a.jpg?v=1752170822' },
  { name: 'Cold Coffee', category: 'Milkshakes', description: 'Chilled coffee served over ice.', amount: 400, image: 'https://ximg.retty.me/crop/s1200x900/-/retty/img_repo/2l/01/37265927.jpg' },
  { name: 'Mixed Fruit Milkshake', category: 'Milkshakes', description: 'A creamy shake blended with mixed fruits.', amount: 400, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=80' },
  { name: 'Special Jelly', category: 'Special Drinks', description: 'Chilled creamy drink with colorful jelly pieces.', amount: 350, image: 'https://media.indozone.id/crop/1200x630%3A0x0/smart/photo/p2/94/2024/03/10/resep-es-jelly-untuk-jualan-1017675268.jpg' },
  { name: 'Special Flavored Slush', category: 'Special Drinks', description: 'Refreshing crushed-ice slush in a special flavor.', amount: 100, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Special Strawberry Shake', category: 'Special Drinks', description: 'Our special creamy strawberry shake.', amount: 320, image: 'https://www.sylter-eiscafe-fischeln.de/images/SEC-Eroeff-1-min.jpg' },
  { name: 'Ice Cola', category: 'Special Drinks', description: 'Chilled cola served over ice.', amount: 150, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80' },
  { name: 'Special Ice Cola', category: 'Special Drinks', description: 'Special ice-cold cola with extra refreshment.', amount: 350, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=700&q=80' },
  { name: 'Meethi Lassi', category: 'Special Drinks', description: 'Traditional sweet yogurt lassi, served chilled.', amount: 180, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=80' },
  { name: 'Namkeen Lassi', category: 'Special Drinks', description: 'Traditional salted yogurt lassi, served chilled.', amount: 120, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=80' },
  { name: 'Lemon Soda', category: 'Special Drinks', description: 'Sparkling lemon soda with ice.', amount: 150, image: 'https://image.kkday.com/v2/image/get/s1.kkday.com/product_542496/20251105062415_cwFoz/png' },
  { name: 'Sting Soda', category: 'Special Drinks', description: 'Chilled Sting soda.', amount: 200, image: 'https://dukaan.b-cdn.net/1000x1000/webp/asgard/8339c9d02eaf3f0359e2ac48bd197909d9faf6bcd1fac0facd72549696b1f865.jpg' },
  { name: 'Regular Drink', category: 'Cold Drinks', description: 'A regular chilled soft drink.', amount: 100, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80' },
  { name: 'Drink Can', category: 'Cold Drinks', description: 'A chilled soft drink can.', amount: 120, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80' },
  { name: 'Drink · 500 ml', category: 'Cold Drinks', description: '500 ml chilled soft drink bottle.', amount: 130, image: 'https://keryanastore.com/kapp/Images/ItemImages/1151850250_KS-Pepsi-500ml.jpg' },
  { name: 'Drink · 1 Litre', category: 'Cold Drinks', description: '1 litre chilled soft drink bottle.', amount: 180, image: 'https://greenvalley.pk/cdn/shop/files/Pepsi20120Ltr_35f66aa1-28e1-4d4a-8ad2-4c937992274e.webp?v=1755495238' },
  { name: 'Drink · 1.5 Litre', category: 'Cold Drinks', description: '1.5 litre chilled soft drink bottle.', amount: 220, image: 'https://www.5050.pk/uploaded/product/drinks-pepsi-1-5-liters-price.JPG' },
  { name: 'Water', category: 'Cold Drinks', description: 'Bottled water. Choose a size.', sizes: { Small: 50, Large: 100 }, amount: 50, price: 'Rs. 50', image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=700&q=80' },
  { name: 'Tea', category: 'Hot Beverages', description: 'A comforting cup of hot tea.', amount: 100, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80' },
  { name: 'Doodh Patti', category: 'Hot Beverages', description: 'Traditional strong milk tea.', amount: 120, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=700&q=80' },
  { name: 'Coffee', category: 'Hot Beverages', description: 'Freshly brewed hot coffee.', amount: 250, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80' },
  { name: 'Cappuccino', category: 'Hot Beverages', description: 'Espresso with steamed milk and foam.', amount: 350, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=80' },
  { name: 'Green Tea', category: 'Hot Beverages', description: 'A light, soothing cup of green tea.', amount: 70, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80' },
].map((item) => ({ ...item, price: item.price || `Rs. ${item.amount}`, tag: item.tag || 'Beverage' }))

const riceMenuItems = [
  { name: 'Savour Half Plate', category: 'Biryani and Pulao', description: 'Pilaf served with one shami kebab and one chicken piece.', amount: 350, price: 'Rs. 350', tag: 'Savour plate', image: 'https://images.deliveryhero.io/image/fd-pk/products/3281829.jpg?width=700' },
  { name: 'Savour Full Plate', category: 'Biryani and Pulao', description: 'Pilaf served with two shami kebabs and two chicken pieces.', amount: 600, price: 'Rs. 600', tag: 'Savour plate', image: 'https://g-cdn.blinkco.io/ordering-system/55324/dish_image/1663842876.jpg' },
  { name: 'Savour Half Sada Plate', category: 'Biryani and Pulao', description: 'Half plate of plain sada rice.', amount: 200, price: 'Rs. 200', tag: 'Sada plate', image: 'https://g-cdn.blinkco.io/ordering-system/55324/dish_image/1663843451.jpg' },
  { name: 'Savour Full Sada Plate', category: 'Biryani and Pulao', description: 'Full plate of plain sada rice.', amount: 350, price: 'Rs. 350', tag: 'Sada plate', image: 'https://g-cdn.blinkco.io/ordering-system/55324/dish_image/1663843451.jpg' },
  { name: 'Kabuli Pulao · Full', category: 'Biryani and Pulao', description: 'A full serving of Kabuli pulao with carrots and raisins.', amount: 600, price: 'Rs. 600', tag: 'Rice favourite', image: 'https://i.tribune.com.pk/media/images/507332-food-1360856854/507332-food-1360856854-640x480.webp' },
  { name: 'Degi Biryani', category: 'Biryani and Pulao', description: 'Traditional degi biryani, available full or half.', sizes: { Full: 3000, Half: 1500 }, amount: 3000, price: 'Rs. 3,000', tag: 'Degi classic', image: 'https://www.mixthali.com/web/image/product.template/201/image_1920?unique=4bab7fc' },
  { name: 'Biryani', category: 'Biryani and Pulao', description: 'Pakistani biryani, available as a single or double serving.', sizes: { Single: 180, Double: 350 }, amount: 180, price: 'Rs. 180', tag: 'Rice favourite', image: 'https://assets.indolj.io/upload/1729841848-Biryani-Single.jpg' },
]

const desiMenuItems = [...barbecueMenuItems, ...karahiMenuItems, ...fishMenuItems, ...riceMenuItems]

const pepsi500Image = 'https://keryanastore.com/kapp/Images/ItemImages/1151850250_KS-Pepsi-500ml.jpg'
const pepsi1LImage = 'https://greenvalley.pk/cdn/shop/files/Pepsi20120Ltr_35f66aa1-28e1-4d4a-8ad2-4c937992274e.webp?v=1755495238'
const pepsi15LImage = 'https://www.5050.pk/uploaded/product/drinks-pepsi-1-5-liters-price.JPG'
const dealCoverImages = {
  'Student Deal': 'https://cdn.qrmenu.com/gyros-and-tzatziki/mydop-images/img40c9dda7-135b-43fd-b266-1a896dee96a5.webp',
  'Grill Burger Deal': 'https://imageproxy.wolt.com/assets/6870ca9e9aa298f40fee4126',
  'Beef Lovers Deal': 'https://images.axios.com/fZPAuINxfj4tsg3kk9uAZt5SaA8%3D/2025/01/10/1736537123766.jpg',
  'Shawarma Deal': 'https://d3bjg1d9dlypct.cloudfront.net/online-store/images/bb5e08a1-eda2-4b85-a555-b250ae2d905c.jpg',
  'Chinese Deal': 'https://images.deliveryhero.io/image/fd-pk/Products/98792781.jpg?width=900',
  'Family Deal': 'https://rs-menus-api.roocdn.com/images/6c489085-92dc-488d-ad81-c77bec5c5189/image.jpeg?fit=crop&height=630&width=1200',
  'Surprising Deal': 'https://images.deliveryhero.io/image/fd-pk/LH/h1hb-listing.jpg',
  'Super Deal': 'https://images.deliveryhero.io/image/fd-pk/LH/idlb-listing.jpg',
}
const studentDeals = [
  { name: 'Student Deal', amount: 600, includes: ['1 Zinger Burger', 'Half portion fries', '1 drink'], drinkImage: pepsi500Image, drinkSize: '500 ml' },
  { name: 'Grill Burger Deal', amount: 1200, includes: ['1 Beef Grill Burger', '1 Chicken Grill Burger', '1 Regular Fries', '1 × 500 ml drink'], drinkImage: pepsi500Image, drinkSize: '500 ml' },
  { name: 'Beef Lovers Deal', amount: 2100, includes: ['2 Special Beef Paratha Rolls', '2 Special Beef Grill Burgers', '1 Family Fries', '1 × 1 litre drink'], drinkImage: pepsi1LImage, drinkSize: '1 L' },
  { name: 'Shawarma Deal', amount: 2000, includes: ['3 Chicken Tikka Shawarmas', '3 Beef Tikka Shawarmas', '1 Family Fries', '1 × 1.5 litre drink'], drinkImage: pepsi15LImage, drinkSize: '1.5 L' },
  { name: 'Chinese Deal', amount: 3000, includes: ['Chicken Chilli Dry with Fried Rice', 'Chicken Manchurian with Rice', 'Beef Chilli Dry with Fried Rice', 'Russian Salad', '3 fresh lemonades'] },
  { name: 'Family Deal', amount: 4300, includes: ['5 Zinger Burgers', '5 Crispy Chicken pieces', '10 Chicken Nuggets', '1 Family Fries', '1 × 1.5 litre drink'], drinkImage: pepsi15LImage, drinkSize: '1.5 L' },
  { name: 'Surprising Deal', amount: 2500, includes: ['1 Tandoori Burger', 'Half Pizza Fries', 'Half Malai Boti Pizza Pasta', '1 Fish Burger', '1 Chicken Sandwich', '1 Family Fries', '1 × 1 litre drink'], drinkImage: pepsi1LImage, drinkSize: '1 L' },
  { name: 'Super Deal', amount: 5000, includes: ['1 Medium pizza', '1 Zinger Burger', '1 Tandoori Burger', '1 Chicken Tikka Shawarma', '1 Beef Shawarma', '1 Chicken Paratha Roll', '1 Special Turkish Chicken Grilled Wrap', '5 Crispy Chicken Wings', 'Half Pizza Fries', 'Half Pizza Pasta', '1 Family Fries', '1 × 1.5 litre drink'], drinkImage: pepsi15LImage, drinkSize: '1.5 L' },
].map((deal) => ({
  ...deal,
  category: 'Student Deals',
  price: `Rs. ${deal.amount}`,
  description: deal.includes.join(' · '),
  image: dealCoverImages[deal.name],
}))

const platterDeals = [
  { name: 'Platter Number 1', amount: 4000, includes: ['1 Full Pulao', '1 Half Deghi Chargha', '1 Malai Boti', '1 Chicken Boti', '1 Seekh Afghani Tikka', '1 Seekh Beef Tikka', '2 Reshmi Kebabs', '2 Beef Kebabs', '1 Seekh Gola Kebab', '1 Roast Bater', '1 × 1 litre cold drink', '2 Dahi Raita'], drinkImage: pepsi1LImage, drinkSize: '1 L', image: 'https://g-cdn.blinkco.io/ordering-system/55324/dish_image/1663842876.jpg' },
  { name: 'Platter Number 2', amount: 3200, includes: ['1 Full Pulao', '1 Full Deghi Chargha', '1 Chicken Boti', '1 Malai Boti', '1 Beef Boti', '2 Raita', '2 Roghani Naan'], image: 'https://cdn.restaurants-info.com/mypeshawarbatley/21899-albums-8.jpg' },
  { name: 'Platter Number 3', amount: 2600, includes: ['1 Full Pulao', '1 Full Deghi Chargha', '1 Raita', '1 Roghani Naan', '1 Half-litre drink', '1 Double Biryani'], drinkImage: pepsi500Image, drinkSize: '500 ml', image: 'https://images.deliveryhero.io/image/fd-pk/products/3281829.jpg?width=700' },
  { name: 'Platter Number 4', amount: 1900, includes: ['1 Full Pulao', '1 Half Deghi Chargha', 'Half Malai Boti', 'Half Chicken Boti', '2 Reshmi Kebabs', '1 Half-litre drink'], drinkImage: pepsi500Image, drinkSize: '500 ml', image: 'https://images.deliveryhero.io/image/fd-pk/Products/70735281.jpg?width=700' },
  { name: 'Barbecue Special Supreme Platter', amount: 7500, includes: ['Half Chicken Karahi', 'Half Chicken Handi', 'Half Deghi Chargha', '1 Leg Piece', '1 Chest Piece', '1 Seekh Gola Kebab', '1 Roast Bater', '1 Plate Chicken Boti', '1 Plate Malai Boti', '1 Seekh Afghani Tikka', '1 Seekh Beef Tikka', '2 Reshmi Kebabs', '2 Beef Kebabs', '2 Full Pulao', '2 Raita', '1 × 1 litre drink', '5 Roghani Naan'], drinkImage: pepsi1LImage, drinkSize: '1 L', image: 'https://images.deliveryhero.io/image/fd-pk/Products/97547904.jpg?height=700&width=700' },
  { name: 'Deghi Chargha Deal', amount: 1700, includes: ['1 Full Sada Pulao', '1 Full Chargha'], image: 'https://images.deliveryhero.io/image/fd-pk/products/12632736.jpg?height=700&width=700' },
  { name: 'Deghi Chargha Double Deal', amount: 1900, includes: ['1 Full Beef Pulao', '1 Full Chargha'], image: 'https://images.deliveryhero.io/image/fd-pk/products/12632736.jpg?height=700&width=700' },
  { name: 'Deghi Chargha Half Deal', amount: 1000, includes: ['1 Half Pulao', '1 Half Chargha'], image: 'https://images.deliveryhero.io/image/fd-pk/products/12632736.jpg?height=700&width=700' },
].map((deal) => ({ ...deal, category: 'Platters', price: `Rs. ${deal.amount}`, description: deal.includes.join(' · ') }))

const burgerIngredients = {
  'Tandoori Burger': ['Sesame bun', 'Tandoori-style patty'],
  'Special Surprise Burger': ['Top bun', 'Chicken fillet', 'Beef patty', 'Cheese', 'Jalapeño', 'Fries', 'Bottom bun'],
  'Special Volcano Burger': ['Top bun', 'Beef patty or chicken fillet', 'Cheese block', 'Fries', 'Bottom bun'],
  'Special Student Burger': ['Top bun', 'Zinger chicken patty', 'Cheese', 'Fries', 'Bottom bun'],
  'Double Tower Grill Burger': ['Top bun', 'Double chicken fillet or beef patty', 'Cheese', 'Special sauces', 'Jalapeño', 'Fries', 'Bottom bun'],
  'Double Decker Zinger Burger': ['Top bun', 'Zinger fillet', 'Cheese', 'Zinger fillet', 'Fries', 'Bottom bun'],
  'Zinger Burger': ['Top bun', 'Crispy Zinger fillet', 'Creamy mayo', 'Bottom bun'],
  'Chicken Grill Burger': ['Top bun', 'Chicken fillet', 'Special mayo sauce', 'Bottom bun'],
  'Beef Grill Burger': ['Top bun', 'Beef patty', 'Jalapeño', 'Special barbecue sauce', 'Bottom bun'],
  'Chicken Tikka Burger': ['Top bun', 'Chicken tikka', 'Jalapeño', 'Peri-peri sauce', 'Bottom bun'],
  'Chicken Patty Burger': ['Top bun', 'Chicken patty', 'Special burger mayo', 'Bottom bun'],
  'Fish Burger': ['Top bun', 'Fish fillet', 'Bottom bun'],
  'Shami Burger': ['Top bun', 'Shami patty', 'Bottom bun'],
  'Campus Smash': ['Top bun', 'Double smashed beef', 'Cheddar', 'Pickles', 'House sauce', 'Bottom bun'],
  'Crispy Chick': ['Top bun', 'Crispy chicken', 'Slaw', 'Spicy mayo', 'Bottom bun'],
}

const pizzaIngredients = {
  'Special Student Cafe Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken tikka', 'Beef sausage', 'Bell pepper', 'Onion'],
  'Crown Crust Pizza': ['Pizza dough', 'Cheese-filled crown crust', 'Tomato sauce', 'Mozzarella cheese', 'Chicken', 'Bell pepper'],
  'Kebab Crust Pizza': ['Pizza dough', 'Kebab-filled crust', 'Tomato sauce', 'Mozzarella cheese', 'Kebab pieces', 'Onion'],
  'Kababish Special Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Kababish kebab', 'Onion', 'Green pepper'],
  'Cheese Crust Pizza': ['Pizza dough', 'Cheese-filled crust', 'Tomato sauce', 'Mozzarella cheese'],
  'Bihari Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Bihari chicken', 'Onion', 'Green pepper'],
  'Four Flavor Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken tikka quarter', 'Fajita chicken quarter', 'Barbecue chicken quarter', 'Pepperoni quarter'],
  'Chicken Tikka Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken tikka', 'Red onion', 'Green pepper'],
  'Chicken Fajita Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Fajita chicken', 'Green pepper', 'Onion'],
  'Chicken Supreme Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken', 'Beef sausage', 'Olives', 'Bell pepper'],
  'Chicken Italian Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken', 'Mushrooms', 'Olives', 'Italian herbs'],
  'Beef Tikka Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Beef tikka', 'Red onion', 'Green pepper'],
  'Barbecue Pizza': ['Pizza dough', 'Barbecue sauce', 'Mozzarella cheese', 'Barbecue chicken', 'Onion'],
  'Pineapple Pizza': ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Pineapple'],
  'Calzone Pizza': ['Folded pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Chicken filling'],
}

function Home({ cart, addToCart, changeQuantity, removeFromCart, clearCart, cartOpen, setCartOpen, homeView, favoriteItems, setFavoriteItems, favoritesOpen, setFavoritesOpen, isAuthenticated, onAuthenticationConfirmed, authPromptOpen, setAuthPromptOpen, loginSuccessOpen, setLoginSuccessOpen }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMenuType, setSelectedMenuType] = useState('Fast Food Items')
  const [selectedBurger, setSelectedBurger] = useState(null)
  const visibleCategories = selectedMenuType === 'Fast Food Items' ? categories : selectedMenuType === 'Desi Food Items' ? desiCategories : beverageCategories
  const filteredItems = selectedMenuType === 'Fast Food Items'
    ? (selectedCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === selectedCategory))
    : (selectedMenuType === 'Desi Food Items' ? desiMenuItems : beverageMenuItems).filter((item) => item.category === selectedCategory)
  const toggleFavorite = (item) => {
    if (!isAuthenticated || !hasActiveLoginToken()) {
      setAuthPromptOpen(true)
      return
    }
    onAuthenticationConfirmed()
    setFavoriteItems((current) => current.some((favorite) => favorite.name === item.name) ? current.filter((favorite) => favorite.name !== item.name) : [...current, item])
  }
  const renderMenuCards = (items) => items.map((item) => <MenuCard key={item.name} item={item} onAddToCart={addToCart} onViewIngredients={setSelectedBurger} isFavorite={favoriteItems.some((favorite) => favorite.name === item.name)} onToggleFavorite={() => toggleFavorite(item)} />)

  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>Big cravings,<br /><em>better bites.</em></h1>
          <p>From sizzling Pakistani classics to fast food favourites, find something fresh to love at Student Cafe.</p>
          <div className="hero-actions"><a className="button button-primary" href="#menu">Explore our menu <span>↓</span></a><span className="hero-note">Made fresh for your next break.</span></div>
        </div>
        <div className="hero-visual"><img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=90" alt="Fresh cheeseburger with melted cheese and crisp lettuce" /><div className="hero-sticker"><span>MADE FRESH</span><b>Every<br />single day</b><i>✳</i></div><div className="hero-caption"><span>STUDENT FAVOURITE</span><b>Big flavour, good value</b></div></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="wrap">
          <div className="section-heading" id={homeView === 'deals' ? 'student-deals' : homeView === 'platters' ? 'platters' : undefined}>
            <div><span className="eyebrow">{homeView === 'deals' ? 'BUNDLES MADE FOR STUDENTS' : homeView === 'platters' ? 'MADE FOR SHARING' : 'PICK YOUR HAPPY'}</span><h2>{homeView === 'deals' ? 'Student Deals' : homeView === 'platters' ? 'Platters' : 'What are you craving?'}</h2></div>
            <p>{homeView === 'deals' ? 'More favourites together, at one clear price.' : homeView === 'platters' ? 'Big Pakistani favourites for family and friends.' : <>Made fresh, priced for students,<br />and always worth the walk over.</>}</p>
          </div>
          {homeView === 'deals' ? (
            <div className="deal-grid">{studentDeals.map((deal) => <DealCard key={deal.name} deal={deal} onAddToCart={addToCart} />)}</div>
          ) : homeView === 'platters' ? (
            <div className="deal-grid">{platterDeals.map((deal) => <DealCard key={deal.name} deal={deal} onAddToCart={addToCart} />)}</div>
          ) : <>
          <div className="menu-type-row" aria-label="Choose menu">
            {[{ name: 'Desi Food Items', image: 'photo-1585937421612-70a008356fbe' }, { name: 'Fast Food Items', image: 'photo-1568901346375-23c9450c58cd' }, { name: 'Beverages', image: 'https://cdn.uengage.io/uploads/32975/image-5789-1776674101.jpg' }].map((type) => (
              <button key={type.name} className={`menu-type-button ${selectedMenuType === type.name ? 'active' : ''}`} onClick={() => { setSelectedMenuType(type.name); setSelectedCategory(type.name === 'Fast Food Items' ? 'All' : type.name === 'Desi Food Items' ? 'Barbecue' : 'Milkshakes') }} aria-pressed={selectedMenuType === type.name}>
                <span className="menu-type-image"><img src={getFoodImageUrl(type.image, 320)} alt="" /></span><span>{type.name}</span>
              </button>
            ))}
          </div>
          <div className="category-row" aria-label={`Filter ${selectedMenuType} by category`}>
            {visibleCategories.map((category) => (
              <button key={category.name} className={`category-button ${selectedCategory === category.name ? 'active' : ''}`} onClick={() => setSelectedCategory(category.name)} aria-pressed={selectedCategory === category.name}>
                <span className={`category-circle ${['Fish', 'Crispy Chicken', 'Fries', 'Cold Drinks', 'Hot Beverages'].includes(category.name) ? 'category-circle-contain' : ''}`}><img src={getFoodImageUrl(category.image || categoryImages[category.name] || fallbackImages.Burgers, 180)} alt="" /></span><span>{category.name}</span>
              </button>
            ))}
          </div>
          <div className="menu-heading"><h3>{selectedMenuType === 'Fast Food Items' && selectedCategory === 'All' ? 'Campus favourites' : `${selectedCategory} menu`}</h3><span>{`${filteredItems.length} delicious picks`}</span></div>
          {selectedMenuType === 'Desi Food Items' ? (
            filteredItems.length ? <div className="food-grid">{renderMenuCards(filteredItems)}</div> : <div className="empty-menu-state"><h3>{selectedCategory} items coming soon</h3><p>This category is ready. Add dishes and prices here whenever you’re ready.</p></div>
          ) : selectedCategory === 'Pizza' ? (
            <div className="pizza-flavor-sections">
              {['Special Flavors', 'Normal Flavors'].map((section) => {
                const sectionItems = filteredItems.filter((item) => item.section === section)
                return <section className="pizza-flavor-section" key={section}><div className="pizza-section-heading"><div><span className="eyebrow">{section === 'Special Flavors' ? 'HOUSE SIGNATURES' : 'CLASSIC FAVOURITES'}</span><h3>{section}</h3></div><span>Small · Medium · Large · Extra Large</span></div><div className="food-grid">{renderMenuCards(sectionItems)}</div></section>
              })}
            </div>
          ) : <div className="food-grid">{renderMenuCards(filteredItems)}</div>}
          <div className="menu-footer"><span>Can’t decide? That’s a good problem to have.</span><a href="/register">Join the café crew <span>→</span></a></div>
          </>}
        </div>
      </section>

      <section className="visit-strip wrap" id="visit"><div><span className="eyebrow">YOUR NEW CAMPUS SPOT</span><h2>Good food. No fuss.<br /><em>See you at the café.</em></h2></div><div className="visit-details"><span>📍 &nbsp;College Town Plaza: opposite Government Post Graduate College, College Town, Pindi Road, Kohat</span><span>🕒 &nbsp;Open daily, 10am – 10pm</span><a className="button button-dark" href="/register">Come on in <span>↗</span></a></div></section>

      <footer className="site-footer"><div className="wrap footer-inner"><a className="footer-brand" href="/">Student<span>Cafe.</span></a><span>Made for campus life, served with a smile.</span><a href="#menu">Back to the good stuff ↑</a></div></footer>
      {cartOpen && <CartPanel cart={cart} changeQuantity={changeQuantity} removeFromCart={removeFromCart} isAuthenticated={isAuthenticated} onRequireAuth={() => { setCartOpen(false); setAuthPromptOpen(true) }} onOrderClick={clearCart} onClose={() => setCartOpen(false)} />}
      {favoritesOpen && <FavoritesPanel items={favoriteItems} onRemove={toggleFavorite} onAddToCart={addToCart} onClose={() => setFavoritesOpen(false)} />}
      {authPromptOpen && <AuthRequiredPrompt onClose={() => setAuthPromptOpen(false)} />}
      {loginSuccessOpen && <LoginSuccessPopup onClose={() => setLoginSuccessOpen(false)} />}
      {selectedBurger && <BurgerShowcase item={selectedBurger} ingredients={(selectedBurger.category === 'Pizza' ? pizzaIngredients : burgerIngredients)[selectedBurger.name] || []} onClose={() => setSelectedBurger(null)} addToCart={addToCart} />}
    </main>
  )
}

function DealCard({ deal, onAddToCart }) {
  return (
    <article className="deal-card">
      <div className="deal-image-stage">
        <img className="deal-cover-image" src={getFoodImageUrl(deal.image, 900)} alt={`${deal.name} meal spread`} loading="lazy" />
        {deal.drinkImage && <div className={`deal-drink-image ${deal.drinkSize === '1.5 L' ? 'large' : deal.drinkSize === '1 L' ? 'medium' : 'small'}`}><img src={getFoodImageUrl(deal.drinkImage, 260)} alt={`${deal.drinkSize} Pepsi bottle`} loading="lazy" /><span>{deal.drinkSize} Pepsi</span></div>}
      </div>
      <div className="deal-card-body">
        <div className="deal-title-row"><h3>{deal.name}</h3><b>{deal.price}</b></div>
        <ul>{deal.includes.map((item) => <li key={item}>{item}</li>)}</ul>
        <button className="add-cart-button" onClick={() => onAddToCart(deal)}>+ Add deal to cart</button>
      </div>
    </article>
  )
}

function MenuCard({ item, onAddToCart, onViewIngredients, isFavorite, onToggleFavorite }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes ? Object.keys(item.sizes)[0] : '')
  const amount = item.sizes ? item.sizes[selectedSize] : item.amount
  const selectedItem = item.sizes ? { ...item, size: selectedSize, amount, price: `Rs. ${amount}` } : item
  const handleAddToCart = () => onAddToCart(selectedItem)
  const handleImageError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return
    event.currentTarget.dataset.fallbackApplied = 'true'
    event.currentTarget.src = getFoodImageUrl(fallbackImages[item.category] || 'photo-1624153064067-566cae78993d')
  }

  return (
    <article className="food-card">
      <div className="food-image">
        {item.category === 'Burgers' || item.category === 'Pizza'
          ? <button className="food-image-trigger" onClick={() => onViewIngredients(selectedItem)} aria-label={`View ${item.name} ingredients`}><img src={getFoodImageUrl(item.image)} alt={item.name} onError={handleImageError} /></button>
          : <img src={getFoodImageUrl(item.image)} alt={item.name} onError={handleImageError} />}
        <button type="button" className={`favorite-button${isFavorite ? ' saved' : ''}`} onClick={(event) => { event.stopPropagation(); onToggleFavorite() }} aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`} aria-pressed={isFavorite}>{isFavorite ? '\u2665' : '\u2661'}</button>
      </div>
      <div className="food-info"><div><span className="food-category">{item.category}</span><h4>{item.name}</h4></div><b className="food-price">Rs. {amount}</b></div>
      {item.sizes && <label className="pizza-size-control"><span>Choose size</span><select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} aria-label={`Choose size for ${item.name}`}>{Object.keys(item.sizes).map((size) => <option key={size} value={size}>{size} · Rs. {item.sizes[size]}</option>)}</select></label>}
      <p>{item.description}</p>
      {(item.category === 'Burgers' || item.category === 'Pizza') && <button className="ingredients-link" onClick={() => onViewIngredients(selectedItem)}>Explore ingredients <span>↗</span></button>}
      <button className="add-cart-button" onClick={handleAddToCart}>+ Add to cart</button>
    </article>
  )
}

function BurgerShowcase({ item, ingredients, onClose, addToCart }) {
  const kindFor = (ingredient) => {
    const text = ingredient.toLowerCase()
    if (item.category === 'Pizza') {
      if (text.includes('dough') || text.includes('crust')) return 'pizza-base'
      if (text.includes('sauce')) return 'pizza-sauce'
      if (text.includes('cheese')) return 'pizza-cheese'
      if (text.includes('chicken') || text.includes('beef') || text.includes('kebab') || text.includes('sausage') || text.includes('pepperoni')) return 'pizza-protein'
      if (text.includes('onion') || text.includes('pepper') || text.includes('olive') || text.includes('mushroom') || text.includes('pineapple') || text.includes('herb')) return 'pizza-topping'
      return 'pizza-protein'
    }
    if (text.includes('bun')) return text.includes('bottom') ? 'bun-bottom' : 'bun-top'
    if (text.includes('fries')) return 'fries'
    if (text.includes('cheese')) return 'cheese'
    if (text.includes('jalapeño')) return 'jalapeno'
    if (text.includes('sauce') || text.includes('mayo')) return 'sauce'
    if (text.includes('lettuce') || text.includes('slaw')) return 'greens'
    if (text.includes('pickle')) return 'pickle'
    if (text.includes('tomato')) return 'tomato'
    if (text.includes('chicken') || text.includes('zinger') || text.includes('fish') || text.includes('shami')) return 'fillet'
    return 'patty'
  }

  return (
    <div className="showcase-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="burger-showcase" role="dialog" aria-modal="true" aria-labelledby="showcase-title">
        <button className="showcase-close" onClick={onClose} aria-label="Close burger details">×</button>
        <div className="showcase-photo" style={{ backgroundImage: `url("${getFoodImageUrl(item.image, 1200)}")` }} />
        <div className="showcase-copy"><span className="eyebrow">{item.category === 'Pizza' ? 'A SLICE, LAYER BY LAYER' : 'TAKE A CLOSER BITE'}</span><h2 id="showcase-title">{item.name}</h2><p>{item.description}</p>{item.category === 'Pizza' && <small className="showcase-note">Illustrative flavor preview; exact toppings may vary.</small>}<b className="showcase-price">{item.price}{item.size ? ` · ${item.size}` : ''}</b><button className="button button-primary" onClick={() => { addToCart(item); onClose() }}>Add to cart <span>+</span></button></div>
        <div className={`exploded-stage ${item.category === 'Pizza' ? 'pizza-exploded-stage' : ''}`}><div className="stage-glow" /><div className="exploded-stack">{ingredients.map((ingredient, index) => <div className={`exploded-layer layer-${kindFor(ingredient)}`} style={{ '--layer-index': index, '--layer-total': ingredients.length }} key={`${ingredient}-${index}`}><span className="layer-shape" /><b>{ingredient}</b></div>)}</div><span className="stage-caption">{item.category === 'Pizza' ? 'FLAVOR PREVIEW · LAYER BY LAYER' : 'BUILT FRESH · LAYER BY LAYER'}</span></div>
        <div className="showcase-ingredients"><span className="eyebrow">THE GOOD STUFF INSIDE</span><div>{ingredients.map((ingredient, index) => <span key={`${ingredient}-tag`}><i>{String(index + 1).padStart(2, '0')}</i>{ingredient}</span>)}</div></div>
      </section>
    </div>
  )
}

function FavoritesPanel({ items, onRemove, onAddToCart, onClose }) {
  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="cart-drawer favorites-drawer" role="dialog" aria-modal="true" aria-labelledby="favorites-title">
        <div className="cart-header"><div><span className="eyebrow">SAVED FOR LATER</span><h2 id="favorites-title">Favorites <span>({items.length})</span></h2></div><button className="cart-close" onClick={onClose} aria-label="Close favorites">×</button></div>
        {items.length === 0 ? <div className="cart-empty"><span className="favorites-empty-heart">♡</span><h3>No favorites yet</h3><p>Tap the heart on any menu photo to save it here.</p><button className="button button-primary" onClick={onClose}>Explore the menu</button></div> : <div className="cart-items">{items.map((item) => <div className="cart-item favorite-item" key={item.name}><img src={getFoodImageUrl(item.image, 180)} alt="" /><div className="cart-item-info"><b>{item.name}{item.size ? ` · ${item.size}` : ''}</b><span>{item.price || `Rs. ${item.amount}`}</span><button className="add-cart-button" onClick={() => onAddToCart(item)}>Add to cart</button><button className="cart-remove" onClick={() => onRemove(item)}>Remove from favorites</button></div></div>)}</div>}
      </section>
    </div>
  )
}

function AuthRequiredPrompt({ onClose }) {
  return (
    <div className="auth-required-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="auth-required-card" role="dialog" aria-modal="true" aria-labelledby="auth-required-title">
        <button className="cart-close auth-required-close" onClick={onClose} aria-label="Close sign-in prompt">×</button>
        <span className="eyebrow">JOIN THE CAFE CREW</span>
        <h2 id="auth-required-title">Sign up before you order</h2>
        <p>Create an account to add items to your cart, save favorites, and place an order.</p>
        <div className="auth-required-actions"><Link className="button button-primary" to="/register" onClick={onClose}>Create account</Link><Link className="auth-login-link" to="/login" onClick={onClose}>Already signed up? Log in</Link></div>
      </section>
    </div>
  )
}

function LoginSuccessPopup({ onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(timer)
  }, [onClose])

  const startOrdering = () => {
    onClose()
    window.setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <div className="login-success-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="login-success-popup" role="status" aria-live="polite">
        <button className="login-success-close" onClick={onClose} aria-label="Close sign-in message">×</button>
        <span className="login-success-check" aria-hidden="true">✓</span>
        <span className="login-success-eyebrow">YOU’RE IN</span>
        <h2>Login successful!</h2>
        <p>Welcome back. Your favourites are ready—place your order whenever you’re hungry.</p>
        <button className="login-success-action" onClick={startOrdering}>Start your order <span>↓</span></button>
      </section>
    </div>
  )
}

function CartPanel({ cart, changeQuantity, removeFromCart, isAuthenticated, onRequireAuth, onOrderClick, onClose }) {
  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const total = cart.reduce((sum, entry) => sum + entry.item.amount * entry.quantity, 0)
  const orderSummary = cart.map(({ item, quantity }) => `${quantity} x ${item.name}${item.size ? ` (${item.size})` : ''}`).join(', ')
  const orderText = [
    `Hi Student Cafe! I would like to order: ${orderSummary}.`,
    ...cart.map(({ item, quantity }) => `${quantity} x ${item.name}${item.size ? ` (${item.size})` : ''} - Rs. ${item.amount * quantity}`),
    `Total: Rs. ${total}`,
    'Is this available?',
  ].join('\n')
  const whatsappUrl = `https://wa.me/${CAFE_WHATSAPP}?text=${encodeURIComponent(orderText)}`
  const emailOrderUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CAFE_EMAIL)}&su=${encodeURIComponent('Student Cafe order')}&body=${encodeURIComponent(orderText)}`

  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header"><div><span className="eyebrow">YOUR GOOD STUFF</span><h2 id="cart-title">Your cart <span>({itemCount})</span></h2></div><button className="cart-close" onClick={onClose} aria-label="Close cart">×</button></div>
        {cart.length === 0 ? <div className="cart-empty"><span>🛍️</span><h3>Your cart is taking a study break.</h3><p>Add something tasty from the menu and it’ll show up here.</p><button className="button button-primary" onClick={onClose}>Explore the menu</button></div> : <>
          <div className="cart-items">{cart.map(({ item, quantity }) => <div className="cart-item" key={`${item.name}-${item.size || 'regular'}`}><img src={getFoodImageUrl(item.image, 180)} alt="" /><div className="cart-item-info"><b>{item.name}{item.size ? ` · ${item.size}` : ''}</b><span>{item.price}</span>{item.includes && <small>{item.includes.join(', ')}</small>}<div className="quantity-control"><button onClick={() => changeQuantity(item, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{quantity}</span><button onClick={() => changeQuantity(item, 1)} aria-label={`Add one ${item.name}`}>+</button></div><button className="cart-remove" onClick={() => removeFromCart(item)}>Remove from cart</button></div><b className="cart-line-total">Rs. {item.amount * quantity}</b></div>)}</div>
          <div className="cart-summary"><div><span>Subtotal</span><b>Rs. {total}</b></div><small>We’ll confirm pickup or delivery with you on WhatsApp or email.</small>{isAuthenticated ? <a className="whatsapp-order" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => { onOrderClick(); onClose() }}>Order on WhatsApp <span>↗</span></a> : <button className="auth-order-button" onClick={onRequireAuth}>Sign up to place your order</button>}<a className="cart-email" href={emailOrderUrl} target="_blank" rel="noreferrer" onClick={() => { onOrderClick(); onClose() }}>Email this order to {CAFE_EMAIL}</a></div>
        </>}
      </section>
    </div>
  )
}

const App = () => {
  const [cart, setCart] = useState(() => {
    if (!hasActiveLoginToken()) return []
    try {
      const savedCart = JSON.parse(localStorage.getItem('studentCafeCart') || '[]')
      return Array.isArray(savedCart) ? savedCart.filter((entry) => entry?.item && Number.isFinite(entry.quantity) && entry.quantity > 0) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [favoriteItems, setFavoriteItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studentCafeFavorites') || '[]')
    } catch {
      return []
    }
  })
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const [loginSuccessOpen, setLoginSuccessOpen] = useState(false)
  const [homeView, setHomeView] = useState('menu')
  const [isAuthenticated, setIsAuthenticated] = useState(hasActiveLoginToken)
  const [authChecked, setAuthChecked] = useState(true)
  const addToCart = (item) => {
    if (!hasActiveLoginToken()) {
      setIsAuthenticated(false)
      setAuthPromptOpen(true)
      return
    }
    setCart((current) => {
    const existing = current.find((entry) => entry.item.name === item.name && entry.item.size === item.size)
    return existing ? current.map((entry) => entry.item.name === item.name && entry.item.size === item.size ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { item, quantity: 1 }]
    })
  }
  const changeQuantity = (item, amount) => setCart((current) => current.map((entry) => entry.item.name === item.name && entry.item.size === item.size ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0))
  const removeFromCart = (item) => setCart((current) => current.filter((entry) => entry.item.name !== item.name || entry.item.size !== item.size))
  const clearCart = () => {
    setCart([])
    localStorage.removeItem('studentCafeCart')
  }
  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('studentCafeCart')
    localStorage.removeItem('studentCafeFavorites')
    setIsAuthenticated(false)
    setAuthChecked(true)
    setCart([])
    setFavoriteItems([])
    setCartOpen(false)
    setFavoritesOpen(false)
    setAuthPromptOpen(false)
  }

  useEffect(() => {
    if (!authChecked) return
    if (!isAuthenticated) {
      localStorage.removeItem('studentCafeFavorites')
      if (favoriteItems.length) setFavoriteItems([])
      return
    }
    localStorage.setItem('studentCafeFavorites', JSON.stringify(favoriteItems))
  }, [favoriteItems, isAuthenticated, authChecked])

  useEffect(() => {
    if (!isAuthenticated || !hasActiveLoginToken()) {
      localStorage.removeItem('studentCafeCart')
      if (cart.length) setCart([])
      return
    }
    localStorage.setItem('studentCafeCart', JSON.stringify(cart))
  }, [cart, isAuthenticated])

  return (
    <Router>
      <Navbar cartCount={itemCount} favoriteCount={favoriteItems.length} isAuthenticated={isAuthenticated} onLogout={logout} onFavoritesClick={() => { if (!authChecked || !isAuthenticated) setAuthPromptOpen(true); else { setFavoritesOpen(true); setCartOpen(false) } }} onCartClick={() => { setCartOpen(true); setFavoritesOpen(false) }} onMenuClick={() => setHomeView('menu')} onStudentDealsClick={() => setHomeView('deals')} onPlattersClick={() => setHomeView('platters')} />
      <Routes>
        <Route path="/" element={<Home cart={cart} addToCart={addToCart} changeQuantity={changeQuantity} removeFromCart={removeFromCart} clearCart={clearCart} cartOpen={cartOpen} setCartOpen={setCartOpen} homeView={homeView} favoriteItems={favoriteItems} setFavoriteItems={setFavoriteItems} favoritesOpen={favoritesOpen} setFavoritesOpen={setFavoritesOpen} isAuthenticated={isAuthenticated} onAuthenticationConfirmed={() => { setIsAuthenticated(true); setAuthChecked(true) }} authPromptOpen={authPromptOpen} setAuthPromptOpen={setAuthPromptOpen} loginSuccessOpen={loginSuccessOpen} setLoginSuccessOpen={setLoginSuccessOpen} />} />
        <Route path="/register" element={<Register onAuthenticated={() => { setIsAuthenticated(true); setAuthChecked(true) }} />} />
        <Route path="/login" element={<Login onAuthenticated={() => { setIsAuthenticated(true); setAuthChecked(true); setLoginSuccessOpen(true) }} />} />
        <Route path="/dashboard" element={<Dashboard isAuthenticated={isAuthenticated} authChecked={authChecked} />} />
      </Routes>
      <Chatbot menuItems={[...menuItems, ...desiMenuItems, ...beverageMenuItems, ...studentDeals, ...platterDeals]} ingredients={{ ...burgerIngredients, ...pizzaIngredients }} />
    </Router>
  )
}

export default App
