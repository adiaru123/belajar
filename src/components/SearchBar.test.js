// SearchBar.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

// Mocking the child components
jest.mock('./Movie', () => () => <div>Mocked Movie Component</div>);
jest.mock('./DefaultList', () => () => <div>Mocked Default List</div>);

describe('SearchBar Component', () => {
  // Test 1: Render the search input field
  it('should render the search input field', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search/i);
    expect(input).toBeInTheDocument();
  });

  // Test 2: Check if Movie component is rendered when searchQuery is not empty
  it('should display the Movie component when searchQuery is not empty', async () => {
    // Mocking the fetch API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: ['Movie 1', 'Movie 2'] })
    });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'movie' } });

    await waitFor(() => expect(screen.getByText(/Mocked Movie Component/)).toBeInTheDocument());
  });

  // Test 3: Check if DefaultList component is displayed when searchQuery is empty
  it('should display the DefaultList component when searchQuery is empty', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText(/Mocked Default List/)).toBeInTheDocument();
  });

  // Test 4: Check if error message is displayed when the API request fails
  it('should display an error message if the API request fails', async () => {
    // Mocking the fetch API to simulate a failure
    global.fetch = jest.fn().mockRejectedValue(new Error('API request failed'));

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'movie' } });

    await waitFor(() => expect(screen.getByText(/An error occurred while fetching movies/)).toBeInTheDocument());
  });

  // Test 5: Check if the movie list and error message are cleared when searchQuery is empty
  it('should clear the movie list and error message when searchQuery is empty', async () => {
    // Mocking the fetch API to simulate successful response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: ['Movie 1', 'Movie 2'] })
    });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search/i);

    // Simulate a search
    fireEvent.change(input, { target: { value: 'movie' } });
    await waitFor(() => expect(screen.getByText(/Mocked Movie Component/)).toBeInTheDocument());

    // Clear the search input
    fireEvent.change(input, { target: { value: '' } });

    // Verify if the DefaultList is displayed after clearing the search query
    expect(screen.getByText(/Mocked Default List/)).toBeInTheDocument();
  });
});
