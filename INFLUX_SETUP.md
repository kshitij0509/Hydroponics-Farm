# InfluxDB Integration Setup

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Environment Variables
Add to your `.env` file:
```
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-influx-token
INFLUX_ORG=your-org-name
INFLUX_BUCKET=sensors
```

## 3. InfluxDB Setup
1. Create organization: `hydroponics`
2. Create bucket: `sensors`
3. Generate API token with read/write permissions
4. Update `.env` with your token

## 4. Test Connection
```bash
node test-influx.js
```

## 5. API Endpoints
- `GET /api/influx/test` - Test connection
- `GET /api/influx/latest/:cropId` - Get latest readings
- `POST /api/sensors/data` - Receive sensor data

## 6. Data Flow
ESP32 → MQTT → Node.js → MongoDB + InfluxDB

## 7. Grafana Integration (Next Step)
- Connect Grafana to InfluxDB
- Create dashboards for sensor visualization
- Use InfluxQL or Flux queries