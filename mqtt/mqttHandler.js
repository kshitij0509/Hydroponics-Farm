const mqtt = require('mqtt');
const CropReading = require('../models/cropreading');
const Crop = require('../models/crop');

class MQTTHandler {
  constructor() {
    this.client = mqtt.connect('mqtt://192.168.1.11:1883');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('✅ MQTT Connected to EMQX broker');
      this.client.subscribe('sensors/ec', (err) => {
        if (err) {
          console.error('❌ Failed to subscribe to sensors/ec:', err);
        } else {
          console.log('✅ Successfully subscribed to sensors/ec topic');
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
      const { ec_value, temperature, ph, crop_id } = data;
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
        batch_no: `AUTO_${Date.now()}`,
        crop: cropId
      });
      
      await reading.save();
      console.log('✅ EC sensor data saved successfully:', { ec, temperature, cropId });
    } catch (error) {
      console.error('❌ Error saving sensor data:', error);
    }
  }
}

module.exports = MQTTHandler;