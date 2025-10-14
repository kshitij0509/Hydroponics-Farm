# InfluxDB Queries for Hydroponics Data

## Correct Measurement Name
Your measurement is: `sensor_reading`

## Basic Queries

### Get all sensor data from last hour
```flux
from(bucket: "hydroponics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
```

### Get EC values only
```flux
from(bucket: "hydroponics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
  |> filter(fn: (r) => r._field == "ec")
```

### Get pH values only
```flux
from(bucket: "hydroponics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
  |> filter(fn: (r) => r._field == "ph")
```

### Get temperature values only
```flux
from(bucket: "hydroponics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
  |> filter(fn: (r) => r._field == "temperature")
```

### Get data for specific crop
```flux
from(bucket: "hydroponics")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
  |> filter(fn: (r) => r.crop_id == "your-crop-id-here")
```

### Get latest 10 readings with all fields
```flux
from(bucket: "hydroponics")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "sensor_reading")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 10)
```