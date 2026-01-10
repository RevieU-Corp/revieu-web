import React from 'react';

const TestPage: React.FC = () => {
  console.log('TestPage is rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Test Page Working!
        </h1>
        <p>If you can see this, React and routing are working correctly.</p>
        <p>Current URL: {window.location.href}</p>
      </div>
    </div>
  );
};

export default TestPage;