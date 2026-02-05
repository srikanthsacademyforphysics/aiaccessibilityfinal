// Vercel Serverless Function for Object Finding
// Deploy this to Vercel as a serverless function

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { image, objectName } = req.body;

    if (!image || !objectName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing image or objectName' 
      });
    }

    // TODO: Replace with your actual AI service (OpenAI Vision, Google Vision, etc.)
    // For now, this is a placeholder that returns a mock response
    
    // Example: Using OpenAI Vision API
    // const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4-vision-preview',
    //     messages: [
    //       {
    //         role: 'user',
    //         content: [
    //           { type: 'text', text: `Is there a ${objectName} visible in this image? If yes, describe its location and how to reach it. If no, provide guidance on where to look.` },
    //           { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } }
    //         ]
    //       }
    //     ],
    //     max_tokens: 200
    //   })
    // });
    // const data = await openaiResponse.json();
    // const response = data.choices[0].message.content;
    // const found = response.toLowerCase().includes('yes') || response.toLowerCase().includes('found');
    // const guidance = response;

    // TEMPORARY MOCK RESPONSE - Replace with actual AI integration
    const found = false; // Mock: object not found
    const guidance = `I don't see a ${objectName} in the current view. Try moving the camera slowly left, right, up, or down. Check common locations like tables, desks, or nearby surfaces.`;

    return res.status(200).json({
      success: true,
      found: found,
      guidance: guidance
    });

  } catch (error) {
    console.error('Find object error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
