import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // server: {
    //   proxy: {
    //     '/backend/api': {
    //       target: 'http://localhost:8000',
    //       changeOrigin: true,
    //       secure: false
    //     }
    //   }
    // }
    server: {
        host: true, // Allow access from network
        port: 5173, // Optional but recommended
    },
});

// // vite.config.js
// export default {
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/public': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// }
