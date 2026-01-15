const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kemet_platform');
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Create test users
    const testUsers = [
      {
        name: 'Admin Principal',
        email: 'admin@kemet-energy.bj',
        password: 'admin123',
        role: 'administrateur',
        kwBalance: 0,
        isActive: true
      },
      {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        password: 'client123',
        role: 'client',
        kwBalance: 25,
        isActive: true
      },
      {
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        password: 'client123',
        role: 'client',
        kwBalance: 50,
        isActive: true
      },
      {
        name: 'Pierre Durand',
        email: 'pierre.durand@example.com',
        password: 'client123',
        role: 'client',
        kwBalance: 10,
        isActive: true
      }
    ];

    // Hash passwords and create users
    for (const userData of testUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n🎉 Database initialized successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMINISTRATEUR:');
    console.log('   Email: admin@kemet-energy.bj');
    console.log('   Password: admin123');
    console.log('   Role: administrateur');
    console.log('');
    console.log('👤 CLIENTS:');
    testUsers.filter(u => u.role === 'client').forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Solde: ${user.kwBalance} kW`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Instructions:');
    console.log('1. Démarrez le backend: cd backend && npm run dev');
    console.log('2. Démarrez le frontend: npm run dev');
    console.log('3. Testez la connexion avec les comptes ci-dessus');
    console.log('4. Admins voient l\'onglet "Gestion" avec le dashboard admin');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;