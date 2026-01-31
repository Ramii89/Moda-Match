const express = require('express');
const cors = require('cors');
const app = express();
const aiRoutes = require("./routes/ai");
app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);

// بيانات تجريبية في الذاكرة (بدون MongoDB)
const outfits = [
    {
        id: 1,
        season: 'winter',
        event: 'date',
        gender: 'male',
        bodyShape: 'A',
        top: 'Burgundy shirt',
        bottom: 'Grey trousers',
        shoes: 'Brown leather shoes',
        accessories: 'Silver watch',
        colors: ['burgundy', 'grey', 'brown'],
        recommendedStores: ['zara', 'h&m']
    },
    {
        id: 2,
        season: 'summer',
        event: 'sport',
        gender: 'male',
        bodyShape: 'B',
        top: 'White t-shirt',
        bottom: 'Black shorts',
        shoes: 'White sneakers',
        accessories: 'Baseball cap',
        colors: ['white', 'black'],
        recommendedStores: ['shein', 'temu']
    },
    {
        id: 3,
        season: 'winter',
        event: 'date',
        gender: 'female',
        bodyShape: 'A',
        top: 'Red sweater with turtleneck',
        bottom: 'Black leather pants',
        shoes: 'Black ankle boots',
        accessories: 'Gold necklace and black purse',
        colors: ['red', 'black', 'gold'],
        recommendedStores: ['shein', 'zara']
    }
];

// تخزين المستخدمين في الذاكرة
let users = [];
let userId = 1;

// Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'ModaMatch API',
        database: 'in-memory',
        timestamp: new Date().toISOString()
    });
});

// Register user
app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;
    
    // Check if user exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user (in real app, hash password!)
    const user = {
        id: userId++,
        firstName,
        lastName,
        email,
        password, // في التطبيق الحقيقي، يجب تشفير كلمة المرور!
        gender,
        createdAt: new Date()
    };
    
    users.push(user);
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender
        }
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender
        }
    });
});
// Reset password
app.post('/api/auth/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});


// Get outfit suggestions
app.post('/api/outfits/suggest', (req, res) => {
    const { season, event, gender, bodyShape } = req.body;
    
    let filteredOutfits = outfits;
    
    if (season) {
        filteredOutfits = filteredOutfits.filter(o => 
            o.season.toLowerCase() === season.toLowerCase()
        );
    }
    
    if (event) {
        filteredOutfits = filteredOutfits.filter(o => 
            o.event.toLowerCase() === event.toLowerCase()
        );
    }
    
    if (gender) {
        filteredOutfits = filteredOutfits.filter(o => 
            o.gender.toLowerCase() === gender.toLowerCase()
        );
    }
    
    if (bodyShape) {
        filteredOutfits = filteredOutfits.filter(o => 
            o.bodyShape.toUpperCase() === bodyShape.toUpperCase()
        );
    }
    
    if (filteredOutfits.length === 0) {
        // Fallback: get outfits for the gender only
        filteredOutfits = outfits.filter(o => 
            gender ? o.gender.toLowerCase() === gender.toLowerCase() : true
        ).slice(0, 3);
        
        return res.json({
            success: true,
            message: 'General suggestions (no exact match found)',
            outfits: filteredOutfits
        });
    }
    
    res.json({
        success: true,
        message: 'Outfit suggestions found',
        outfits: filteredOutfits
    });
});

// Get all outfits
app.get('/api/outfits', (req, res) => {
    res.json({
        success: true,
        count: outfits.length,
        outfits
    });
});

// Contact form
app.post('/api/contact', (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    
    // في التطبيق الحقيقي، احفظ في قاعدة البيانات
    console.log('Contact message received:', { firstName, lastName, email, message });
    
    res.json({
        success: true,
        message: 'Message sent successfully'
    });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

app.get("/", (req, res) => {
    res.send("ModaMatch API is running successfully");
});

