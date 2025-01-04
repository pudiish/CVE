# CVE Dashboard

Name: Swarnapudi Ishwar

This project is a full-stack web application that allows users to view and explore Common Vulnerabilities and Exposures (CVE) data. It fetches data from the National Vulnerability Database (NVD) API, processes it, and presents it in a user-friendly format. This application features a paginated list of CVEs, detailed views for each CVE, and periodic syncing with the NVD API to ensure the data is up to date.

## Tech Stack

- **Frontend**: React, React Router, Axios, CSS, Bootstrap
- **Backend**: Node.js, Express, MongoDB, Cron Jobs
- **External API**: National Vulnerability Database (NVD) API
- **Database**: MongoDB (for storing CVE data locally)
- **Cron Jobs**: For syncing CVE data daily
- **Deployment**: Can be deployed to any cloud platform (AWS, Heroku, etc.)

## Features

- **Paginated CVE List**:
  - Displays a paginated list of CVEs, showing CVE ID, description, published date, and other relevant details.
  - Pagination controls allow users to browse through multiple pages of CVE entries.

- **Detailed CVE View**:
  - Clicking on a CVE displays detailed information, including:
    - CVE description and impact.
    - CVSS (Common Vulnerability Scoring System) score and vector string.
    - Exploitability and Impact Scores.
    - A list of vulnerable products (CPEs).

- **Syncing Data**:
  - The backend uses a cron job to fetch and update the CVE data every day from the NVD API.
  - The data is stored locally in MongoDB to improve performance and reduce load times.

- **Search Functionality**:
  - Search for CVEs by ID, description, or other criteria (coming soon).
  
- **Responsive Design**:
  - The frontend is fully responsive and works seamlessly across desktop and mobile devices.

## Getting Started

### Prerequisites

To run this application locally, you need to have the following installed:

1. **Node.js**: To run the backend.
2. **MongoDB**: To store CVE data. You can use a local MongoDB instance or a cloud-based service like MongoDB Atlas.
3. **npm (Node Package Manager)**: For managing frontend dependencies.

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/pudiish/CVE.git
   cd CVE
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory of the project and add your MongoDB URI:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```

4. Run the backend server:
   ```bash
   npm start
   ```
   This will start the server on `http://localhost:5001`.

#### Frontend Setup

1. Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the React development server:
   ```bash
   npm start
   ```
   This will start the frontend on `http://localhost:3000`.

#### Running the Full Stack Application

1. Make sure both the backend and frontend servers are running:
   - Backend: `http://localhost:5001`
   - Frontend: `http://localhost:3000`

2. Open your browser and visit `http://localhost:3000` to access the CVE Dashboard.

## API Endpoints

### `/api/cves`

- **Method**: `GET`
- **Description**: Fetches a paginated list of CVEs.
- **Query Parameters**:
  - `page`: Page number (default is `1`).
  - `limit`: Number of CVEs per page (default is `10`).

**Example Request**:
```bash
GET http://localhost:5001/api/cves?page=1&limit=10
```

### `/api/cves/:id`

- **Method**: `GET`
- **Description**: Fetches detailed information for a specific CVE by its ID.
  
**Example Request**:
```bash
GET http://localhost:5001/api/cves/CVE-2021-34527
```

## Cron Jobs

The backend is set up with a cron job that runs every day at midnight to sync the CVE data from the NVD API. This ensures that the local database is updated with the latest CVE information daily.

- **Cron Job**: Runs every day at `0 0 * * *` (midnight).
  
## Future Enhancements

- **Search**: Implement a search feature to allow users to search for CVEs by various criteria (e.g., severity, date range).
- **Filters**: Add filters to refine CVE searches based on severity, publication date, and other parameters.
- **User Authentication**: Implement user authentication for saving search history or favorite CVEs.
- **UI/UX Improvements**: Refine the user interface with better styling, responsiveness, and additional features like tooltips for CVSS scores.

## Contributing

We welcome contributions! If you'd like to improve the project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request to merge your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **National Vulnerability Database (NVD)** for providing the CVE data.
- **React**, **Node.js**, **Express**, **MongoDB** for their great tools that helped build this project.

---

This README file provides a comprehensive guide for your project setup, usage, and contribution. You can modify and extend it as per your needs!
