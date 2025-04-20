# Aquatify

**Aquatify** is a full-stack eCommerce application built with React Native and Node.js. It allows users to browse, manage, and purchase aquatic-themed products. The app includes seller tools to upload, edit, and delete products, and provides a seamless mobile-first shopping experience.

---

## Features

### User
- Browse products by category
- View product details with pricing, ratings, and reviews
- Add products to cart and checkout
- Responsive mobile interface with clean design

### Seller
- Upload new products with images and categories
- Update or delete existing products
- View product rating and total review count
- Automatic price selection from product types

### Backend
- Built with Express + PostgreSQL
- Sequelize ORM for database modeling
- Relational models: Product, Image, Review, ProductType
- Auto-calculated product `rating` and `price` via virtual fields

