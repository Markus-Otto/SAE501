import { useState, useEffect } from 'react';

function Formation() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/formation')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then(data => {
        setFormations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Liste des Formations</h1>
      {formations.map(formation => (
        <div key={formation.id} style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          margin: '10px',
          backgroundColor: formation.active ? '#e8f5e9' : '#ffebee'
        }}>
          <h3>{formation.titre}</h3>
          <p>{formation.description}</p>
          <p><strong>Catégorie:</strong> {formation.categorie}</p>
          <p><strong>Durée:</strong> {formation.nbHeureTotal} heures</p>
          <p><strong>Prix:</strong> {formation.prix}€</p>
          <p><strong>Statut:</strong> {formation.active ? '✅ Active' : '❌ Inactive'}</p>
        </div>
      ))}
    </div>
  );
}

export default Formation