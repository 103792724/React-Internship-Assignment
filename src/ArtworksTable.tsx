
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';

// Let's define what an Artwork looks like
interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const ArtworksTable: React.FC = () => {
    // Here, we set up our state variables
    const [artworks, setArtworks] = useState<Artwork[]>([]); // This will hold our artwork data
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]); // This will track which artworks are selected
    const [page, setPage] = useState(1); // We start on the first page
    const [totalPages, setTotalPages] = useState(0); // This will keep track of how many pages we have

    // This function fetches artworks from the API
    const fetchArtworks = async (page: number) => {
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            setArtworks(response.data.data); // We set the fetched artworks into our state
            setTotalPages(response.data.pagination.total_pages); // And also update the total pages
        } catch (error) {
            console.error("Oops! There was an error fetching the artworks:", error); // Log any errors we encounter
        }
    };

    // This useEffect runs every time the page changes
    useEffect(() => {
        fetchArtworks(page); // Fetch artworks for the current page
    }, [page]);

    // When a row is selected, we add it to our selected artworks
    const onRowSelect = (artwork: Artwork) => {
        setSelectedArtworks((prev) => [...prev, artwork]); // Add the selected artwork to our list
    };

    // If a row is unselected, we remove it from our selected artworks
    const onRowUnselect = (artwork: Artwork) => {
        setSelectedArtworks((prev) => prev.filter((item) => item.id !== artwork.id)); // Remove the unselected artwork
    };

    // This function checks if an artwork is currently selected
    const isSelected = (artwork: Artwork) => {
        return selectedArtworks.some((item) => item.id === artwork.id); // Return true if the artwork is selected
    };

    // This function handles page changes when the user navigates
    const onPageChange = (event: { page: number }) => {
        setPage(event.page + 1); // Update the current page based on user action
    };

    return (
        <div>
            {/* Let's display our artworks in a nice table */}
            <DataTable value={artworks} paginator rows={10} onPage={onPageChange}>
                {/* Here, we add a checkbox for selecting rows */}
                <Column
                    body={(rowData) => (
                        <Checkbox
                            checked={isSelected(rowData)} // Check if this row is selected
                            onChange={(e) => (e.checked ? onRowSelect(rowData) : onRowUnselect(rowData))} // Handle selection or unselection
                        />
                    )}
                />
                {/* Now, let's define the columns for our artwork data */}
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
            {/* Pagination controls to navigate through pages */}
            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
            </div>
        </div>
    );
};

export default ArtworksTable;