const { InfluxDB, Point } = require('@influxdata/influxdb-client');

class InfluxDBClient {
  constructor() {
    this.url = 'http://localhost:8086';
    this.token = 'FZfGp0R6tcwhrsRXTyBFKghSxYcvVui462FrQyIvFmunLI99TVxFuNeLp5SGMBm0BPeTg2q7D-Lyp-IH6kPTyQ==';
    this.org = 'self';
    this.bucket = 'hydroponics';
    
    console.log('🔧 InfluxDB Config:', {
      url: this.url,
      token: this.token.substring(0, 10) + '...',
      org: this.org,
      bucket: this.bucket
    });
    
    this.client = new InfluxDB({ url: this.url, token: this.token });
    this.writeApi = this.client.getWriteApi(this.org, this.bucket);
    this.queryApi = this.client.getQueryApi(this.org);
  }

  async writeSensorData(cropId, sensorData) {
    const { ph, ec, temperature, dht_temperature, humidity } = sensorData;
    
    const point = new Point('sensor_reading')
      .tag('crop_id', cropId)
      .timestamp(new Date());
    
    if (ph !== undefined) point.floatField('ph', ph);
    if (ec !== undefined) point.floatField('ec', ec);
    if (temperature !== undefined) point.floatField('temperature', temperature);
    if (dht_temperature !== undefined) point.floatField('dht_temperature', dht_temperature);
    if (humidity !== undefined) point.floatField('humidity', humidity);
    
    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }

  async getLatestReadings(cropId, limit = 10) {
    const query = `
      from(bucket: "${this.bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "sensor_reading")
        |> filter(fn: (r) => r.crop_id == "${cropId}")
        |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> filter(fn: (r) => exists r.ph and exists r.ec and exists r.dht_temperature)
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: ${limit})
    `;
    
    const result = [];
    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          result.push({
            _id: `influx_${Date.now()}_${Math.random()}`,
            datetime: o._time,
            name: 'InfluxDB Reading',
            ph: o.ph,
            ec: o.ec,
            temperature: o.temperature,
            dht_temperature: o.dht_temperature,
            humidity: o.humidity,
            batch_no: 'INFLUX'
          });
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve(result);
        }
      });
    });
  }
}

module.exports = new InfluxDBClient();