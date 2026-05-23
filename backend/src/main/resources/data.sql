-- Seed data for FactoryFlow
-- Only insert if tables are empty

-- Clients
INSERT IGNORE INTO clients (id, name, location, created_at, updated_at)
VALUES
(1, 'Shree Cement', 'Beawar, Rajasthan', NOW(), NOW()),
(2, 'RCCPL', 'Nimbahera, Rajasthan', NOW(), NOW());

-- Employees (3 for Shree Cement, 2 for RCCPL)
INSERT IGNORE INTO employees (id, name, role, hire_date, default_shift, phone, address, pan, photo_url, paid_leave_balance, sick_leave_balance, client_id, created_at, updated_at)
VALUES
(1, 'Rajesh Kumar', 'Operator', '2023-01-15', 'MORNING', '9876543210', '12 Industrial Area, Sector 5', 'ABCPK1234L', '', 12, 12, 1, NOW(), NOW()),
(2, 'Suresh Patel', 'Operator', '2023-03-20', 'NIGHT', '9876543211', '45 Worker Colony, Block B', 'DEFPK5678M', '', 12, 12, 1, NOW(), NOW()),
(3, 'Amit Singh', 'Supervisor', '2022-06-10', 'GENERAL', '9876543212', '78 Main Road, Sector 12', 'GHIPK9012N', '', 12, 12, 1, NOW(), NOW()),
(4, 'Priya Sharma', 'Operator', '2023-09-01', 'MORNING', '9876543213', '23 New Colony, Block C', 'JKLPK3456P', '', 12, 12, 2, NOW(), NOW()),
(5, 'Vikram Reddy', 'Mechanic', '2022-11-25', 'GENERAL', '9876543214', '56 Tech Park, Sector 8', 'MNOPK7890Q', '', 12, 12, 2, NOW(), NOW());

-- Machines (2 for Shree Cement, 1 for RCCPL)
INSERT IGNORE INTO machines (id, machine_id, type, license_plate, client_id, created_at, updated_at)
VALUES
(1, 'EX-001', 'Excavator', 'MH-12-AB-1234', 1, NOW(), NOW()),
(2, 'DZ-002', 'Bulldozer', 'MH-12-CD-5678', 1, NOW(), NOW()),
(3, 'LD-003', 'Loader', 'MH-12-EF-9012', 2, NOW(), NOW());
