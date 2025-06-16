export default function manifest() {
  return {
    name: "Aski",
    short_name: "Aski",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/aski.svg",
        sizes: "192x192",
        type: "image/svg",
      },
      {
        src: "/aski.svg",
        sizes: "512x512",
        type: "image/svg",
      },
    ],
  };
}
