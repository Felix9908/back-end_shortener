CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    username VARCHAR(50) NOT NULL UNIQUE,     
    password_hash VARCHAR(255) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE,
    last_name VARCHAR(100),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    mobile VARCHAR(30),
    withdrawal_method VARCHAR(50),  
    withdrawal_account VARCHAR(255),   
    CPM DECIMAL(10, 2), 
    is_active BOOLEAN DEFAULT TRUE,
    user_type ENUM('admin', 'worker') NOT NULL DEFAULT 'worker',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE urls (
    id INT AUTO_INCREMENT PRIMARY KEY,            
    originalUrl TEXT NOT NULL,               
    shortCode VARCHAR(10) NOT NULL UNIQUE,   
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    userId INT NOT NULL,                            
    FOREIGN KEY (userId) REFERENCES users(id)        
);

CREATE TABLE clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url_id INT NOT NULL,
    userId INT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (url_id) REFERENCES urls(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE url_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    url_id INT NOT NULL UNIQUE,                  
    total_clicks INT DEFAULT 0,                   
    last_clicked_at DATETIME,                   
    FOREIGN KEY (url_id) REFERENCES urls(id)       
);