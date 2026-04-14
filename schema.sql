-- TNG Hotels & Banquets — Database Schema
-- Run with: psql -U tng_user -d tng_hotel -f schema.sql

-- Users / Members
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'member', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Room Types
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'deluxe', 'suite', 'banquet', 'presidential'
  description TEXT,
  price_per_night NUMERIC(10,2) NOT NULL,
  max_occupancy INTEGER DEFAULT 2,
  bed_type VARCHAR(50),
  floor_area_sqft INTEGER,
  amenities TEXT[], -- array of amenity strings
  images TEXT[], -- array of image URLs
  total_rooms INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(15),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_id VARCHAR(255), -- Razorpay payment ID
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  avatar_url VARCHAR(500),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Rooms
INSERT INTO rooms (name, type, description, price_per_night, max_occupancy, bed_type, floor_area_sqft, amenities, images, total_rooms)
VALUES
  (
    'Deluxe Room',
    'deluxe',
    'Spacious deluxe room with modern amenities, city views, and a comfortable king-size bed. Perfect for business or leisure travelers seeking comfort and style.',
    3500,
    2,
    'King Size',
    320,
    ARRAY['Free Wi-Fi', 'AC', 'LCD TV', 'Mini Bar', 'Room Service', 'Safe Locker', 'Work Desk', 'Hot Water'],
    ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    20
  ),
  (
    'Premium Suite',
    'suite',
    'Luxurious suite with a separate living area, premium furnishings, and panoramic city views. An indulgent experience for those who desire the finest.',
    6500,
    3,
    'King Size',
    550,
    ARRAY['Free Wi-Fi', 'AC', '55" Smart TV', 'Mini Bar', 'Butler Service', 'Jacuzzi', 'Lounge Area', 'Premium Toiletries', 'Work Desk', 'Safe Locker'],
    ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    8
  ),
  (
    'Presidential Suite',
    'presidential',
    'The pinnacle of luxury. Our Presidential Suite offers an unmatched experience with exclusive amenities, a private dining area, and bespoke concierge service.',
    12000,
    4,
    'Super King',
    900,
    ARRAY['Free Wi-Fi', 'AC', '65" Smart TV', 'Full Mini Bar', '24/7 Butler', 'Private Jacuzzi', 'Living Room', 'Dining Area', 'Premium Toiletries', 'Airport Transfer'],
    ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    2
  ),
  (
    'Banquet Hall — Royal',
    'banquet',
    'Our signature Royal Banquet Hall accommodates up to 500 guests. Perfect for weddings, corporate events, receptions, and grand celebrations.',
    75000,
    500,
    'N/A',
    5000,
    ARRAY['AC', 'Stage', 'Audio System', 'Projector', 'Bridal Room', 'Catering', 'Valet Parking', 'Floral Decor', 'LED Lighting'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    1
  ),
  (
    'Executive Room',
    'deluxe',
    'Business-focused executive room with a dedicated work zone, high-speed internet, and premium bedding. Ideal for extended corporate stays.',
    4500,
    2,
    'Queen Size',
    380,
    ARRAY['Free Wi-Fi', 'AC', 'Smart TV', 'Mini Bar', 'Room Service', 'Work Desk', 'Iron & Board', 'Coffee Maker'],
    ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],
    10
  );

-- Seed Testimonials (approved)
INSERT INTO testimonials (name, location, rating, review, avatar_url, is_approved)
VALUES
  ('Rajesh Sharma', 'Nagpur, Maharashtra', 5, 'An absolutely magnificent experience. The Presidential Suite was beyond our expectations — the attention to detail and personalized service made our anniversary truly unforgettable. TNG has set a new standard for luxury in Vidarbha.', 'https://i.pravatar.cc/100?img=12', TRUE),
  ('Priya Deshmukh', 'Akola, Maharashtra', 5, 'We hosted our daughter''s wedding at the Royal Banquet Hall and every single guest was amazed. The decor, the food, the coordination — flawless! Thank you TNG team for making the most important day so beautiful.', 'https://i.pravatar.cc/100?img=47', TRUE),
  ('Amit Wankhede', 'Amravati, Maharashtra', 4, 'Stayed for a 3-day business conference. The Executive Rooms are extremely comfortable and the Wi-Fi is blazing fast. Great food at the restaurant too. Will definitely book again for our next corporate retreat.', 'https://i.pravatar.cc/100?img=33', TRUE),
  ('Sunita Patel', 'Pune, Maharashtra', 5, 'Came for a family vacation and the staff went above and beyond. The Premium Suite was gorgeous and the kids loved the amenities. The pool area is beautiful. Highly recommended for families!', 'https://i.pravatar.cc/100?img=48', TRUE),
  ('Vikram Kothari', 'Mumbai, Maharashtra', 5, 'The food quality is exceptional — we hosted a corporate dinner and everyone was raving about it for weeks. The banquet team''s coordination was impeccable. TNG is truly world-class.', 'https://i.pravatar.cc/100?img=15', TRUE),
  ('Meena Joshi', 'Yavatmal, Maharashtra', 4, 'Beautiful property with excellent service. The Deluxe Rooms are well-appointed and very clean. The breakfast spread is outstanding. Looking forward to coming back for a longer stay!', 'https://i.pravatar.cc/100?img=49', TRUE);

-- Seed Admin User (password: Admin@123)
INSERT INTO users (name, email, password_hash, phone, role)
VALUES ('TNG Admin', 'admin@tnghotels.com', '$2b$10$rOzJqQKxLnQ1nQ1nQ1nQ1O8K5Wb5Wb5Wb5Wb5Wb5Wb5Wb5Wb5Wb5W', '9876543210', 'admin');

-- Note: Replace admin password hash with actual bcrypt hash in production
-- Generate with: node -e "const b=require('bcryptjs');b.hash('Admin@123',10).then(console.log)"
