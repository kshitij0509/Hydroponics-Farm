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
    const { ph, ec, temperature } = sensorData;
    
    const point = new Point('sensor_reading')
      .tag('crop_id', cropId)
      .floatField('ph', ph || 0)
      .floatField('ec', ec || 0)
      .floatField('temperature', temperature || 0)
      .timestamp(new Date());
    
    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }

  async getLatestReadings(cropId, limit = 10) {
    const query = `
      from(bucket: "${this.bucket}")
        |> range(start: -2m)
        |> filter(fn: (r) => r._measurement == "sensor_reading")
        |> filter(fn: (r) => r.crop_id == "${cropId}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
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
            ph: o.ph || 0,
            ec: o.ec || 0,
            temperature: o.temperature || 0,
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