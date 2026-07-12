import type { MetadataRoute } from "next";

const baseUrl = "https://safetconsultancy.co.uk";

const routes = ["", "/about", "/services", "/mgn-681", "/track-record", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
