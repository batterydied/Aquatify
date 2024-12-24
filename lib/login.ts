async function fetchUserData(email: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/user/fetch/${encodeURIComponent(email)}`); // Make the request
      if (!response.ok) { // Check for response status
        throw new Error(`Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the response JSON
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error); // Log any errors
      return null;
    }
}