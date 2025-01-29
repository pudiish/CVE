# CVE Dashboard 🛡️

A full-stack web application that fetches, stores, and displays Common Vulnerabilities and Exposures (CVE) data from the National Vulnerability Database (NVD) API. Built with React, Node.js, and MongoDB, this dashboard provides real-time access to security vulnerability information with daily automated updates.

## Features

- **Real-time CVE Data**: Synchronized daily with the NVD database
- **Fast Performance**: Local MongoDB storage for quick data access
- **Detailed Information**: CVSS scores, exploitability metrics, and impact analysis
- **Paginated Views**: Efficient browsing of CVE records
- **Comprehensive Search**: Filter by CVE ID, year, severity, and more

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS 

### **CVE Dashboard**
- ![CVE Dashboard](https://drive.google.com/uc?export=view&id=1f8Yv8_OzAy5QHDbbE8kwzn4K3EBXVefR)

### **CVE List**
- ![CVE List](https://drive.google.com/uc?export=view&id=186Hc1pwYz-Lo0XcZaoCgrUbKMmDTbPM7)

### **CVE Details with Back Button Navigation** 
- ![CVE Details with Back Button Navigation](https://drive.google.com/uc?export=view&id=1W74_p6c_SpCCL6lU-JzMItw5FMTsvzQi)

### Backend
- Node.js & Express
- MongoDB
- Mongoose
- Node-cron for automated syncs

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)
- npm

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pudiish/CVE.git
   cd CVE
   ```

2. **Backend Setup**
   ```bash
   npm install
   ```
   
   Create a `.env` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
   
   Start the server:
   ```bash
   npm start
   ```
   The backend will run on http://localhost:5001

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on http://localhost:3000

## API Documentation

### Get Paginated CVE List
```bash
GET /api/cves?page=1&limit=10
```
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `id`: Search by CVE ID
- `year`: Filter by publication year
- `score`: Filter by minimum CVSS score
- `modifiedDays`: Get CVEs modified in last X days

### Get CVE Details
```bash
GET /api/cves/:id
```

## Automated Updates

The application uses cron jobs to sync with the NVD API daily at midnight. Data is fetched in batches of 100 to respect API rate limits and efficiently stored in MongoDB using upsert operations.

```javascript
cron.schedule("0 0 * * *", syncCVEs);
```


## Author

Swarnapudi Ishwar

## Acknowledgments

- National Vulnerability Database (NVD) for providing the CVE data
- The open-source community for the amazing tools and libraries
