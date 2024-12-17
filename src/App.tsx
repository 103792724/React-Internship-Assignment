// src/App.tsx
import React from 'react';
import ArtworksTable from './ArtworksTable'// Importing the ArtworksTable component to display our artworks

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Artworks</h1>
            {/* Here we render the ArtworksTable component that we created */}
            <ArtworksTable />
        </div>
    );
};

export default App;