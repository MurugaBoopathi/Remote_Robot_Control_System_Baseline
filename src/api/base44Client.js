
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://s4-remote-robot-management-de5430e4.base44.app'

export const base44 = {
  http: axios.create({ baseURL: API_BASE + '/api' }),
  entities: {
    Robot: {
      list: async () => (await base44.http.get('/robots')).data,
      create: async (payload) => (await base44.http.post('/robots', payload)).data,
    },
    Telemetry: {
      list: async (limit=10) => (await base44.http.get(`/telemetry?limit=${limit}`)).data
    },
    UpdateJob: {
      list: async (limit=50) => (await base44.http.get(`/updates?limit=${limit}`)).data,
      schedule: async (robot_id, version) => (await base44.http.post('/updates', {robot_id, version})).data
    },
    Health: {
      get: async () => (await base44.http.get('/health')).data
    },
    Commands: {
      send: async (robot_id, action, params) => (await base44.http.post('/commands', {robot_id, action, params})).data
    }
  }
}
