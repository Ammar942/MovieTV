import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { url, method } = req;
  
  // Simple mock API responses for demo purposes
  if (url?.includes('/api/auth/login') && method === 'POST') {
    const { email, password } = req.body || {};
    
    // Mock authentication - in a real app, this would validate against a database
    if (email && password) {
      return res.status(200).json({
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 1, email: email }
      });
    } else {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  }
  
  if (url?.includes('/api/auth/signup') && method === 'POST') {
    const { email, password } = req.body || {};
    
    if (email && password) {
      return res.status(201).json({
        id: Date.now(),
        email: email
      });
    } else {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  }
  
  if (url?.includes('/api/entries')) {
    if (method === 'GET') {
      // Mock entries data
      return res.status(200).json({
        entries: [
          {
            id: 1,
            title: 'The Matrix',
            type: 'Movie',
            director: 'The Wachowskis',
            releaseYear: 1999,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Breaking Bad',
            type: 'TV Show',
            director: 'Vince Gilligan',
            releaseYear: 2008,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        totalCount: 2
      });
    }
    
    if (method === 'POST') {
      const { title, type, director, releaseYear } = req.body || {};
      
      if (title && type && director && releaseYear) {
        return res.status(201).json({
          id: Date.now(),
          title,
          type,
          director,
          releaseYear: parseInt(releaseYear),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        return res.status(400).json({ message: 'All fields are required' });
      }
    }
  }
  
  // Default 404 response
  return res.status(404).json({ message: 'API endpoint not found' });
}