const mqtt = require('mqtt');
const CropReading = require('../models/cropreading');
const Crop = require('../models/crop');
const influxDB = require('../influxdb');

class MQTTHandler {
  constructor() {
    this.client = mqtt.connect('mqtt://localhost:1883');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('✅ MQTT Connected to EMQX broker');
      this.client.subscribe(['sensors/ec', 'sensors/temperature', 'sensors/dht/temperature', 'sensors/dht/humidity', 'sensors/ph'], (err) => {
        if (err) {
          console.error('❌ Failed to subscribe to sensor topics:', err);
        } else {
          console.log('✅ Successfully subscribed to sensor topics');
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      console.log('📨 Received MQTT message on topic:', topic);
      console.log('📄 Message content:', message.toString());
      
      if (topic === 'sensors/ec') {
        try {
          const data = JSON.parse(message.toString());
          console.log('📊 Parsed sensor data:', data);
          await this.saveSensorData(data);
        } catch (error) {
          console.error('❌ Error processing MQTT message:', error);
        }
      } else if (topic === 'sensors/temperature') {
        try {
          const tempValue = parseFloat(message.toString());
          const data = {
            temperature: tempValue,
            crop_id: '68c93e6e8fbcffb93a2393d5' // Use your crop ID
          };
          console.log('📊 Parsed temperature data:', data);
          await this.saveSensorData(data);
        } catch (error) {
          console.error('❌ Error processing temperature message:', error);
        }
      } else if (topic === 'sensors/dht/temperature') {
        try {
          const dhtTempValue = parseFloat(message.toString());
          const data = {
            dht_temperature: dhtTempValue,
            crop_id: '68c93e6e8fbcffb93a2393d5' // Use your crop ID
          };
          console.log('📊 Parsed DHT temperature data:', data);
          await this.saveSensorData(data);
        } catch (error) {
          console.error('❌ Error processing DHT temperature message:', error);
        }
      } else if (topic === 'sensors/dht/humidity') {
        try {
          const humidityValue = parseFloat(message.toString());
          const data = {
            humidity: humidityValue,
            crop_id: '68c93e6e8fbcffb93a2393d5' // Use your crop ID
          };
          console.log('📊 Parsed DHT humidity data:', data);
          await this.saveSensorData(data);
        } catch (error) {
          console.error('❌ Error processing DHT humidity message:', error);
        }
      } else if (topic === 'sensors/ph') {
        try {
          const data = JSON.parse(message.toString());
          console.log('📊 Parsed pH data:', data);
          await this.saveSensorData(data);
        } catch (error) {
          console.error('❌ Error processing pH message:', error);
        }
      }
    });

    this.client.on('error', (error) => {
      console.error('❌ MQTT connection error:', error);
    });

    this.client.on('offline', () => {
      console.log('⚠️ MQTT client went offline');
    });

    this.client.on('reconnect', () => {
      console.log('🔄 MQTT client reconnecting...');
    });
  }

  async saveSensorData(data) {
    try {
      console.log('💾 Attempting to save sensor data:', data);
      const { ec_value, temperature, ph, crop_id, dht_temperature, humidity } = data;
      const ec = ec_value;
      const cropId = crop_id;
      
      if (!cropId) {
        console.error('❌ No crop ID provided in sensor data');
        return;
      }
      
      console.log('🔍 Looking for crop with ID:', cropId);
      const crop = await Crop.findById(cropId);
      if (!crop) {
        console.error('❌ Crop not found:', cropId);
        return;
      }
      
      console.log('✅ Found crop:', crop.name);
      
      const reading = new CropReading({
        datetime: new Date(),
        name: crop.name,
        ph: ph || crop.ph,
        ec: ec,
        temperature: temperature || crop.temperature,
        dht_temperature: dht_temperature,
        humidity: humidity,
        batch_no: `AUTO_${Date.now()}`,
        crop: cropId
      });
      
      // await reading.save();   to stop preventing the data saved in mongodb for now 
      
      // Save to InfluxDB
      try {
        const sensorData = {};
        
        // Only add pH if explicitly provided by sensor
        if (ph !== undefined && !isNaN(ph)) {
          sensorData.ph = ph;
        }
        
        if (ec !== undefined) sensorData.ec = ec;
        if (temperature !== undefined) sensorData.temperature = temperature;
        if (dht_temperature !== undefined) sensorData.dht_temperature = dht_temperature;
        if (humidity !== undefined) sensorData.humidity = humidity;
        
        await influxDB.writeSensorData(cropId, sensorData);
        console.log('✅ Data saved to InfluxDB:', sensorData);
      } catch (influxError) {
        console.log('⚠️  InfluxDB failed:', influxError.message);
        if (influxError.statusCode === 401) {
          console.log('🔑 InfluxDB authentication issue - check your token in .env');
        }
        console.log('✅ Data saved to MongoDB only:', { ec, temperature, cropId });
      }
    } catch (error) {
      console.error('❌ Error saving sensor data:', error);
    }
  }
}

module.exports = MQTTHandler;