const seeder = require('mongoose-seed');
require('dotenv').config();
 
// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    'src/models/Admin.js'
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Admin'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Data array containing seed data - documents organized by Model
const data = [
    {
        'model': 'Admin',
        'documents': [
            {
                'username': 'admin',
                'password': 'admin'
            }
        ]
    }
];
