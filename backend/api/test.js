// Simple test endpoint to verify Vercel is detecting functions
export default async function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
}
