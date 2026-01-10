import React from 'react';

const SimpleWriteReviewPage: React.FC = () => {
  console.log('SimpleWriteReviewPage is rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      padding: '1rem' 
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Write Review - Simple Version
        </h1>
        <p>This is a simplified version to test if the page loads correctly.</p>
        <p>If you can see this, the routing to WriteReviewPage is working.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Next Steps:</h2>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Test basic page loading ✅</li>
            <li>Add back complex components</li>
            <li>Test AI integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleWriteReviewPage;