export default function manifest() {
  return {
    name: "Aski",
    short_name: "Aski",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d0c22",
    icons: [
      {
        src: "/aski.png",
        sizes: "192x192",
        type: "image/svg",
      },
    ],
  };
}
