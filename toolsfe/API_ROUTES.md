# API Routes Documentation

This document outlines all the API routes used in the Tools Inventory Management & Tracking System.

## Base URL
All API requests are proxied through `/api/router?path=` which forwards to the backend API.

---

## Tools API

### Create Tool
- **Endpoint**: `POST /api/tools`
- **Description**: Create a new tool
- **Request Body**:
```json
{
  "qrCodeId": "string",
  "toolId": "string (6 characters)",
  "partNumber": "string",
  "toolName": "string",
  "toolDescription": "string",
  "supplier": "string"
}
```

### Get All Tools
- **Endpoint**: `GET /api/tools`
- **Description**: Get all tools with pagination
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `size`: Items per page (default: 10)
  - Additional filters as needed

### Get Tool by ID
- **Endpoint**: `GET /api/tools/:id`
- **Description**: Get a specific tool by ID

### Update Tool
- **Endpoint**: `PUT /api/tools/:id`
- **Description**: Update a tool
- **Request Body**: Same as Create Tool (without id)

### Delete Tool
- **Endpoint**: `DELETE /api/tools/:id`
- **Description**: Delete a tool

### Assign Tool
- **Endpoint**: `POST /api/tools/assign`
- **Description**: Assign a tool to a person and location
- **Request Body**:
```json
{
  "toolId": "string",
  "personId": "string",
  "locationId": "string"
}
```

### Check-out Tool
- **Endpoint**: `POST /api/tools/check-out`
- **Description**: Check out a tool (only assigned person can perform this)
- **Request Body**:
```json
{
  "toolId": "string"
}
```

### Check-in Tool
- **Endpoint**: `POST /api/tools/check-in`
- **Description**: Check in a tool (only assigned person can perform this)
- **Request Body**:
```json
{
  "toolId": "string"
}
```

### Get Tool Status
- **Endpoint**: `GET /api/tools/status/:toolId`
- **Description**: Get complete status of a tool including all fields, location, person, and status

---

## Locations API

### Create Location
- **Endpoint**: `POST /api/locations`
- **Description**: Create a new location
- **Request Body**:
```json
{
  "name": "string",
  "type": "string",
  "city": "string",
  "state": "string"
}
```

### Get All Locations
- **Endpoint**: `GET /api/locations`
- **Description**: Get all locations
- **Query Parameters**:
  - `page`: Page number
  - `size`: Items per page

### Get Location by ID
- **Endpoint**: `GET /api/locations/:id`
- **Description**: Get a specific location by ID

### Update Location
- **Endpoint**: `PUT /api/locations/:id`
- **Description**: Update a location
- **Request Body**: Same as Create Location (without id)

### Delete Location
- **Endpoint**: `DELETE /api/locations/:id`
- **Description**: Delete a location

---

## Persons API

### Create Person
- **Endpoint**: `POST /api/persons`
- **Description**: Create a new person
- **Request Body**:
```json
{
  "name": "string",
  "designation": "string",
  "emailId": "string",
  "phoneNumber": "string",
  "immediateBoss": "string"
}
```

### Get All Persons
- **Endpoint**: `GET /api/persons`
- **Description**: Get all persons
- **Query Parameters**:
  - `page`: Page number
  - `size`: Items per page

### Get Person by ID
- **Endpoint**: `GET /api/persons/:id`
- **Description**: Get a specific person by ID

### Update Person
- **Endpoint**: `PUT /api/persons/:id`
- **Description**: Update a person
- **Request Body**: Same as Create Person (without id)

### Delete Person
- **Endpoint**: `DELETE /api/persons/:id`
- **Description**: Delete a person

---

## Dropdown Master API

### Get All Dropdowns
- **Endpoint**: `GET /api/dropdownmaster`
- **Description**: Get all dropdown master data

### Update Dropdown
- **Endpoint**: `PUT /api/dropdownmaster/:dropdownName`
- **Description**: Update a dropdown master entry

---

## QR Code API

### Generate QR Codes
- **Endpoint**: `POST /api/qr-code`
- **Description**: Generate QR codes
- **Request Body**:
```json
{
  "quantity": "number"
}
```

---

## Authentication API

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: User login

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user

### Get All Users
- **Endpoint**: `GET /api/auth/users`
- **Description**: Get all users

### Update User
- **Endpoint**: `PUT /api/auth/users/:id`
- **Description**: Update a user

### Delete User
- **Endpoint**: `DELETE /api/auth/:id`
- **Description**: Delete a user

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Reset user password

---

## Status Options for Tools

The following status values are used throughout the system:

- **Created**: Tool has been created in the system
- **Assigned**: Tool has been assigned to a person and location
- **Checked-in**: Tool has been checked in
- **In-transit**: Tool is in transit

---

## Migration Notes

The following API route changes were made:

1. **Tools** (previously "truck"):
   - `/api/truck` → `/api/tools`
   - `/api/truck/:id` → `/api/tools/:id`
   - `/api/truck/checkin/:id` → `/api/tools/check-in`
   - `/api/truck/checkout/:id` → `/api/tools/check-out`

2. **Locations** (previously "zones"):
   - `/api/zones` → `/api/locations`
   - `/api/zones/:id` → `/api/locations/:id`

3. **Persons**:
   - Already using correct naming: `/api/persons`

---

## Files Updated

The following files were updated to use the new API routes:

- `/components/ToolComponents/index.tsx`
- `/components/ToolComponents/AddToolDialog.tsx`
- `/components/LocationComponents/index.tsx`
- `/components/LocationComponents/AddLocationDialog.tsx`
- `/components/Persons/index.tsx`
- `/components/Persons/AddPersonDialog.tsx`
- `/components/CheckInTools/index.tsx`
- `/components/CheckoutTools/index.tsx`
- `/pages/tools.tsx`
- `/pages/location.tsx`
- `/pages/persons.tsx`
- `/pages/index.tsx`
