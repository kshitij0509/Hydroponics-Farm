# InfluxDB Setup Instructions

## 1. Access InfluxDB UI
Open: http://localhost:8086

## 2. Initial Setup (if first time)
- Username: admin
- Password: (create your password)
- Organization: hydroponics
- Bucket: sensors

## 3. Generate API Token
1. Go to Data → API Tokens
2. Click "Generate API Token"
3. Select "All Access API Token"
4. Copy the token

## 4. Update .env file
```
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-copied-token-here
INFLUX_ORG=hydroponics
INFLUX_BUCKET=sensors
```

## 5. Test Connection
```bash
curl http://localhost:3000/api/influx/test
```

## Current Issue
The "unauthorized access" error means you need to:
1. Set up InfluxDB properly
2. Generate a valid API token
3. Update your .env file with the correct token