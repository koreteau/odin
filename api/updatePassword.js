// hashPassword.js
const bcrypt = require('bcryptjs');

async function hashPassword() {
    const plainPassword = 'Dan2003'; // Remplacez par le mot de passe à hacher
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Hashed Password:', hashedPassword);
}

hashPassword().catch(console.error);
