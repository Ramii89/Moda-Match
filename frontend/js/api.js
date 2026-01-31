const API_BASE = 'http://moda-match-production.up.railway.app/api';

class ModaMatchAPI {
    static async login(email, password) {
        try {
            console.log('🔐 محاولة تسجيل دخول:', email);
            
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'فشل تسجيل الدخول');
            }
            
            console.log('✅ تسجيل الدخول ناجح');
            return data;
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            console.log('📝 محاولة تسجيل:', userData.email);
            
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'فشل التسجيل');
            }
            
            console.log('✅ التسجيل ناجح');
            return data;
            
        } catch (error) {
            console.error('❌ خطأ في التسجيل:', error);
            throw error;
        }
    }

    static async getOutfitSuggestions(filters) {
        try {
            const response = await fetch(`${API_BASE}/outfits/suggest`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(filters)
            });
            
            return await response.json();
        } catch (error) {
            console.error('❌ خطأ في الاقتراحات:', error);
            throw error;
        }
    }

    static isLoggedIn() {
        const user = localStorage.getItem('user');
        return user !== null;
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}
function askAIRecommendation() {
    const gender = document.getElementById("gender").value;
    const occasion = document.getElementById("occasion").value;
    const season = document.getElementById("season").value;

    fetch("http://moda-match-production.up.railway.app/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, occasion, season }),
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("aiResult").innerText =
                "Recommended Outfit: " + data.recommendation;
        });
}
function askAIText() {
    const text = document.getElementById("aiInput").value;

    fetch("http://moda-match-production.up.railway.app/api/ai/recommend-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("aiResult").innerText =
                data.recommendation;
        });
}


