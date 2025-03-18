-- USERS TABLE (For both Admins & Cashiers)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,  -- Replacing email with username
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Cashier') NOT NULL
);

-- GUEST TABLE (Stores guest details)
CREATE TABLE Guest (
    guest_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    document_type ENUM('ID Card', 'SSN') NOT NULL,  -- Specifies if it's an ID or SSN
    document_number VARCHAR(50) UNIQUE NOT NULL  -- Stores the actual ID/SSN number
);

-- ROOM TABLE (Tracks room status)
CREATE TABLE Room (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type ENUM('Single', 'Double', 'Suite') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Reserved', 'Occupied') DEFAULT 'Available'
);

-- RESERVATION TABLE (Handles guest bookings)
CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    guest_id INT NOT NULL,
    user_id INT NOT NULL,  -- Links to Users table (Cashier or Admin)
    room_id INT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    start_from DATETIME NOT NULL,  -- When the reservation starts
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

-- PAYMENT TABLE (Records payments made by guests)
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);
