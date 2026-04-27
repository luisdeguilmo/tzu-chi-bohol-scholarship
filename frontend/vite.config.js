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
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React - rarely changes, stays cached longest
                    "vendor-react": ["react", "react-dom", "react-router-dom"],

                    // HTTP client
                    "vendor-axios": ["axios"],

                    // Chart libraries - large, cache separately
                    "vendor-charts": ["react-chartjs-2", "chart.js"],

                    // Icon libraries - very large (1,226 kB in your case!)
                    "vendor-icons": ["lucide-react", "@iconify/react"],

                    // PDF/Excel - only used in specific pages
                    "vendor-excel": ["exceljs", "file-saver"],

                    // Crop tool - only used in profile photo upload
                    "vendor-crop": ["react-easy-crop"],
                    "vendor-pdf": ["pdfmake"],
                },
            },
        },
        // Optional: warn you when any chunk exceeds 500kb
        chunkSizeWarningLimit: 500,
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
