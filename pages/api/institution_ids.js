// pages/api/institution_ids.js
export default async function handler(req, res) {
    const url = 'https://topology-institutions.osg-htc.org/api/institution_ids';
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  