CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
	  
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
  
CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
  
CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );

INSERT INTO users (id, name, email, password)
        VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'user@nextmail.com', '123456')
        ON CONFLICT (id) DO NOTHING;
		
select * from users;

INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 15795, 'pending', '2022-12-06') ON CONFLICT (id) DO NOTHING;
INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14') ON CONFLICT (id) DO NOTHING;
INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('3958dc9e-787f-4377-85e9-fec4b6a6442a', 3040, 'paid', '2022-10-29') ON CONFLICT (id) DO NOTHING;
INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('50ca3e18-62cd-11ee-8c99-0242ac120002', 44800, 'paid', '2023-9-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f2', 34577, 'pending', '2023-8-5') ON CONFLICT (id) DO NOTHING;
		
select * from invoices;
		
INSERT INTO customers (id, name, email, image_url)
        VALUES ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('3958dc9e-737f-4377-85e9-fec4b6a6442a', 'Hector Simpson', 'hector@simpson.com', '/customers/hector-simpson.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('50ca3e18-62cd-11ee-8c99-0242ac120002', 'Steven Tey', 'steven@tey.com', '/customers/steven-tey.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('3958dc9e-787f-4377-85e9-fec4b6a6442a', 'Steph Dietz', 'steph@dietz.com', '/customers/steph-dietz.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('126eed9c-c90c-4ef6-a4a8-fcf7408d3c66', 'Emil Kowalski', 'emil@kowalski.com', '/customers/emil-kowalski.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png')
        ON conflict (id) DO NOTHING;
INSERT INTO customers (id, name, email, image_url)
        VALUES ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png')
        ON conflict (id) DO NOTHING;

		
select * from customers;

INSERT INTO revenue (month, revenue) VALUES ('Jan', 2000) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Feb', 1800) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Mar', 2200) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Apr', 2500) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('May', 2300) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Jun', 3200) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Jul', 3500) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Aug', 3700) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Sep', 2500) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Oct', 2800) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Nov', 3000) ON CONFLICT (month) DO NOTHING;
INSERT INTO revenue (month, revenue) VALUES ('Dec', 4800) ON CONFLICT (month) DO NOTHING;

select * from revenue;

SELECT COUNT(*) FROM invoices;
SELECT COUNT(*) FROM customers;
SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending" FROM invoices;
SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5;

SELECT * FROM users WHERE email='user@nextmail.com';

Delete from users where email='user@nextmail.com';

