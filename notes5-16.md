bcrypt, an encryption library for node to encrypt passwords --
all that is sent from the frontend is email and password
token is issued at login, on the original post.

select: false, is a method to prevent finding a password by normal User.find methods
joi.trim() will remove whitespaces
class methods in mongoose are created as such userSchema.statics.register

whatever is saved as the password, is encrypted and not saved as what it's literal input was.
this is called hashing
salting is adding a random number into the hashed password
hashing is deterministic, and so fairly easy to divine the original password with brute force




using httpi for password creation:

http post localhost:8000/users

secrets can be generated


JWT-simple node module for encrypting and decrypting JWT
