interface Social {
  name: string;
  url: string;
  icon: string;
}

interface Skill {
  name: string;
  level: number;
  category: 'conception' | 'technique' | 'logiciels' | 'gestion';
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string[];
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
}

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string;
  text: string;
}

export const personalData = {
  name: "Marie Dubois",
  title: "Architecte DPLG",
  bio: "Architecte passionnée avec plus de 5 ans d'expérience dans la conception de bâtiments durables et innovants. Spécialisée dans l'architecture bioclimatique et les projets résidentiels haut de gamme.",
  location: "Paris, France",
  email: "marie@exemple.fr",
  phone: "+33 6 12 34 56 78",
  socials: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin"
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: "Instagram"
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: "Twitter"
    },
  ] as Social[],
};

export const skills: Skill[] = [
  { name: "Conception architecturale", level: 95, category: 'conception' },
  { name: "Design d'intérieur", level: 90, category: 'conception' },
  { name: "Architecture durable", level: 85, category: 'conception' },
  { name: "AutoCAD", level: 90, category: 'logiciels' },
  { name: "Revit", level: 85, category: 'logiciels' },
  { name: "SketchUp", level: 95, category: 'logiciels' },
  { name: "Gestion de projet", level: 80, category: 'gestion' },
  { name: "Réglementation", level: 85, category: 'technique' },
  { name: "Suivi de chantier", level: 75, category: 'technique' },
  { name: "Coordination d'équipe", level: 85, category: 'gestion' }
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Villa Contemporaine",
    description: "Conception d'une villa moderne de 350m² intégrant des principes bioclimatiques et des matériaux durables.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    images: [
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg"
    ],
    category: ["résidentiel", "durable"],
    technologies: ["Revit", "SketchUp", "AutoCAD"],
    demoUrl: "https://exemple.com/villa"
  },
  {
    id: 2,
    title: "Rénovation Haussmannienne",
    description: "Restauration et modernisation d'un appartement haussmannien de 180m² dans le 8ème arrondissement.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg"
    ],
    category: ["rénovation", "patrimoine"],
    technologies: ["AutoCAD", "Photoshop"],
    demoUrl: "https://exemple.com/haussmann"
  },
  {
    id: 3,
    title: "Écoquartier Résidentiel",
    description: "Conception d'un ensemble de 50 logements écologiques avec espaces partagés et jardins communautaires.",
    image: "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg",
    images: [
      "https://images.pexels.com/photos/1643386/pexels-photo-1643386.jpeg",
      "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg",
      "https://images.pexels.com/photos/1643388/pexels-photo-1643388.jpeg"
    ],
    category: ["urbanisme", "durable"],
    technologies: ["Revit", "AutoCAD", "Lumion"],
    demoUrl: "https://exemple.com/ecoquartier"
  },
  {
    id: 4,
    title: "Centre Culturel",
    description: "Création d'un espace culturel polyvalent de 2000m² intégrant une médiathèque et des salles d'exposition.",
    image: "https://images.pexels.com/photos/137594/pexels-photo-137594.jpeg",
    images: [
      "https://images.pexels.com/photos/1643390/pexels-photo-1643390.jpeg",
      "https://images.pexels.com/photos/1643391/pexels-photo-1643391.jpeg"
    ],
    category: ["public", "culturel"],
    technologies: ["Revit", "SketchUp", "Lumion"],
    demoUrl: "https://exemple.com/centre-culturel"
  },
  {
    id: 5,
    title: "Bureaux Flexibles",
    description: "Aménagement de 1500m² d'espaces de travail modulables pour une entreprise tech.",
    image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg",
    images: [
      "https://images.pexels.com/photos/1643392/pexels-photo-1643392.jpeg",
      "https://images.pexels.com/photos/1643393/pexels-photo-1643393.jpeg"
    ],
    category: ["commercial", "design"],
    technologies: ["AutoCAD", "SketchUp"],
    demoUrl: "https://exemple.com/bureaux"
  },
  {
    id: 6,
    title: "Maison Passive",
    description: "Conception d'une maison à énergie positive de 200m² utilisant des technologies innovantes.",
    image: "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg",
    images: [
      "https://images.pexels.com/photos/1643394/pexels-photo-1643394.jpeg",
      "https://images.pexels.com/photos/1643395/pexels-photo-1643395.jpeg"
    ],
    category: ["résidentiel", "durable"],
    technologies: ["Revit", "AutoCAD"],
    demoUrl: "https://exemple.com/passive"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    position: "Directrice",
    company: "Promoteur Immobilier XYZ",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    text: "Marie a su parfaitement traduire notre vision en réalité. Son approche durable et innovante a dépassé nos attentes."
  },
  {
    id: 2,
    name: "Thomas Bernard",
    position: "Propriétaire",
    company: "Villa Contemporaine",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    text: "Travailler avec Marie fut une expérience exceptionnelle. Elle a créé exactement la maison dont nous rêvions."
  },
  {
    id: 3,
    name: "Claire Dubois",
    position: "Directrice Artistique",
    company: "Centre Culturel Municipal",
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    text: "L'expertise de Marie en matière d'espaces culturels a été déterminante dans le succès de notre projet."
  }
];