# Stock Movement Validator

A full-stack application that validates uploaded stock movement JSON using SHA-256 and visualizes the data.

## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Web
- Jackson
- Maven

### Frontend

- React
- Vite
- Axios
- Recharts

## Features

- Upload JSON
- Calculate SHA-256 in browser
- Send file + SHA-256 to backend
- Backend recalculates SHA-256
- Compare hashes
- Parse JSON only after successful verification
- Persist verified JSON
- Date filtering
- IN / OUT filtering
- Warehouse filtering
- Pagination
- IN vs OUT pie chart
- Daily time-series chart

---

# Backend

## Requirements

Java 17+

Maven 3.9+

## Run

```bash
cd backend

mvn clean test

mvn spring-boot:run