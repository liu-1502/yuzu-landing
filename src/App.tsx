import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Landing from "@/pages/Landing";
import Alpha from "@/pages/Alpha";
import Prime from "@/pages/Prime";
import Marketplace from "@/pages/Marketplace";

export default function App() {
  return (
    // basename theo `base` của Vite: GitHub Pages phục vụ ở /<repo>/ chứ không
    // phải gốc domain.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="alpha" element={<Alpha />} />
          <Route path="prime" element={<Prime />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="*" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
