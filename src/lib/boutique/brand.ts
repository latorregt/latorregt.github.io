/** Dirección pública del sitio. Al comprar el dominio propio, cambiar SOLO aquí y en public/robots.txt, y volver a correr `npm run sitemap`. */
export const SITE_URL = "https://latorre.boutiquegt.workers.dev";

export const BRAND = {
  name: "La Torre",
  tagline: "moda y estilo",
  whatsapp: "50257445909",
  whatsappDisplay: "+502 5744 5909",
  phone: "+502 5744 5909",
  phoneInmediato: "+502 4249 2242",
  phoneInmediatoLink: "tel:+50242492242",
  email: "boutiquelatorregt@gmail.com",
  address: "5ª Calle 3-53, Zona 1",
  city: "Santa Cruz del Quiché",
  addressNote: "A pasos del Parque Central",
  addressFull: "5ª Calle 3-53, Zona 1, Santa Cruz del Quiché",
  hours: "Lunes a Domingo 8:45 – 13:00 y 14:30 – 19:00",
  hoursBold: "8:45 – 13:00 y 14:30 – 19:00",
  hoursNote: "Con pausa al mediodía de 13:00 a 14:30",
  social: { tiktok: "https://www.tiktok.com/@latorregt", instagram: "https://www.instagram.com/latorregt/", facebook: "https://www.facebook.com/profile.php?id=100076390299244" },
  maps: { google: "https://maps.app.goo.gl/tojbw7z6uCWTUycX8", waze: "https://www.waze.com/es/live-map/directions?navigate=yes&to=ll.15.02928%2C-91.15031", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d642.9486152866835!2d-91.15028726901205!3d15.02941698942938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858955857502bbb3%3A0x267b6f9ad4bc04d2!2sLa%20Torre!5e0!3m2!1ses!2sgt!4v1793162497481!5m2!1ses!2sgt" },
  shipping: { forza: "https://rastreo.forzadelivery.com/", guatex: "https://guatex.com/paquete/?tipo=G&sitio-paquete=" },
  shippingNote: "Hacemos envíos a toda Guatemala",
  shippingCarriers: "Forza o Guatex",
  shippingTime: "1 a 3 días hábiles",
  shippingCost: "Q35 a Q50",
  freeShippingThreshold: 1250,
  ga4Id: "G-EK0DD0WE83",
} as const;
export const WA_LINK = `https://wa.me/${BRAND.whatsapp}`;
