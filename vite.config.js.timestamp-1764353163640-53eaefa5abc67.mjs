// vite.config.js
import { defineConfig } from "file:///C:/laragon/www/zulzi-trans/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/laragon/www/zulzi-trans/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///C:/laragon/www/zulzi-trans/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\laragon\\www\\zulzi-trans";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/css/app.css",
        "resources/js/main.jsx",
        "resources/js/app.jsx"
      ],
      refresh: true
    }),
    react()
    // ← HAPUS fastRefresh: false
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./resources/js")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  server: {
    hmr: {
      host: "localhost"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFx6dWx6aS10cmFuc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcbGFyYWdvblxcXFx3d3dcXFxcenVsemktdHJhbnNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2xhcmFnb24vd3d3L3p1bHppLXRyYW5zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBsYXJhdmVsIGZyb20gJ2xhcmF2ZWwtdml0ZS1wbHVnaW4nXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbGFyYXZlbCh7XG4gICAgICAgICAgICBpbnB1dDogW1xuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvY3NzL2FwcC5jc3MnLCBcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2pzL21haW4uanN4JyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2pzL2FwcC5qc3gnXG4gICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSwgIC8vIFx1MjE5MCBIQVBVUyBmYXN0UmVmcmVzaDogZmFsc2VcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcmVzb3VyY2VzL2pzJyksXG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy5qc3gnLCAnLnRzJywgJy50c3gnLCAnLmpzb24nXSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICBobXI6IHtcbiAgICAgICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1EsU0FBUyxvQkFBb0I7QUFDclMsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0g7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxNQUVBLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLElBQ2pEO0FBQUEsSUFDQSxZQUFZLENBQUMsT0FBTyxRQUFRLE9BQU8sUUFBUSxPQUFPO0FBQUEsRUFDdEQ7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLEtBQUs7QUFBQSxNQUNELE1BQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
