UPDATE Books
SET Status = '1'
WHERE id = '2';
UPDATE Books
SET Status = '0'
WHERE id = '3';
UPDATE Books
SET Status = '1'
WHERE id = '4';
UPDATE Users
SET Password = '$2a$11$sqj6NMI8c3ItpBTXoiMTuuuYeVmrKsTT9UdLPWG0orehjCrECM//C'
WHERE id = '6';
UPDATE Users
SET Password = '$2a$11$sqj6NMI8c3ItpBTXoiMTuuuYeVmrKsTT9UdLPWG0orehjCrECM//C'
WHERE id = '9';
SELECT Id, Password;
SELECT * FROM Users