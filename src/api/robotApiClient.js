import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://s4-remote-robot-management-de5430e4.base44.app'

export const robotApi = {
  http: axios.create({ baseURL: API_BASE + '/api' }),
  entities: {
    Robot: {
      list: async () => (await robotApi.http.get('/robots')).data,
      create: async (payload) => (await robotApi.http.post('/robots', payload)).data,
    },
    Telemetry: {
      list: async (limit=10) => (await robotApi.http.get(`/telemetry?limit=${limit}`)).data
    },
    UpdateJob: {
      list: async (limit=50) => (await robotApi.http.get(`/updates?limit=${limit}`)).data,
      schedule: async (robot_id, version) => (await robotApi.http.post('/updates', {robot_id, version})).data
    },
    Health: {
      get: async () => (await robotApi.http.get('/health')).data
    },
    Commands: {
      send: async (robot_id, action, params) => (await robotApi.http.post('/commands', {robot_id, action, params})).data
    }
  }
}
