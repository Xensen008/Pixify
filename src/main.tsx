import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import App from "./App";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/QueryProvider";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <QueryProvider>
       <AuthProvider>
          <App />
          <Analytics />
       </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
);
