## Overview

This project provides a simple API that fetches and processes the Dublin Bikes dataset. It derives the schema dynamically from the dataset and allows querying the data through a set of endpoints. The solution handles poorly formatted data by normalizing field names and values into a structured schema.

## Features

1. **Schema Derivation (`/schema`)**

   - Dynamically derives the schema of the Dublin Bikes dataset.
   - Normalizes field names to camelCase.
   - Determines field types (`TEXT`, `INTEGER`, `FLOAT`, `DATE`, `BOOLEAN`, `OPTION`).

2. **Data Querying (`/data`)**

   - Allows filtering using standardized field names.
   - Supports basic operators (`eq`, `lt`, `gt`, `not`).
   - Includes pagination and sorting options.

3. **Middleware for Schema Validation**

   - The middleware ensures the request body for `/data` contains valid filters and operators. Invalid requests are rejected with a detailed error message.
   - Validates the presence of required fields and the correctness of field types.

4. **Fetch by ID (`/data/:id`)**
   - Fetches a single station by its unique ID.
   - Normalizes the result using the derived schema.

## Installation

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/msantdev/dublin-bikes
   cd dublin-bikes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

4. The server will be available at `http://localhost:3000`.

## API Endpoints

### 1. `/schema` (GET)

Returns the dynamically derived schema for the Dublin Bikes dataset.

#### Response Example:

```json
[
  {
    "display": "id",
    "name": "id",
    "type": "INTEGER",
    "options": []
  },
  {
    "display": "Address",
    "name": "address",
    "type": "TEXT",
    "options": []
  },
  {
    "display": "status",
    "name": "status",
    "type": "OPTION",
    "options": ["OPEN", "CLOSED", "MAINTENANCE"]
  }
]
```

### 2. `/data` (POST)

Returns filtered, sorted, and paginated data from the Dublin Bikes dataset (schema validator will show error if body is not valid)

#### Request Body:

```json
{
  "where": {
    "availableBikes": { "gt": 5 }
  },
  "orderBy": {
    "field": "availableBikes",
    "direction": "desc"
  },
  "page": 1,
  "pageSize": 10
}
```

#### Response Example:

```json
{
  "data": [
    {
      "id": 2,
      "address": "Station B",
      "availableBikes": 15,
      "status": "OPEN"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalRecords": 20,
    "totalPages": 2
  }
}
```

### 3. `/data/:id` (GET)

Fetches a single station by its ID.

#### Response Example:

```json
{
  "id": 1,
  "address": "Station A",
  "availableBikes": 10,
  "status": "OPEN"
}
```

## Technical Choices

### 1. **Normalization**

- Used `lodash.camelCase` to standardize field names to camelCase.
- Converted string values to their appropriate types (e.g., `true` -> boolean, `"12"` -> integer).

### 2. **Filtering and Sorting**

- Applied flexible filtering with operators (`eq`, `lt`, `gt`, `not`).
- Sorting implemented with JavaScript's `Array.sort()` to handle numeric and string comparisons.

### 3. **Pagination**

- Implemented using `Array.slice()` for simplicity and efficiency.

## Testing

### Running Tests

To run the tests, use:

```bash
npm test
```

### Test Coverage

- Validates schema derivation for various datasets.
- Ensures filtering, sorting, and pagination work as expected.
- Verifies `/data/:id` returns the correct station or throws an error for invalid IDs.
