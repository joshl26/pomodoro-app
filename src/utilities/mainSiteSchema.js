// mainSiteSchema.ts
export const mainSiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://joshlehman.ca/#person",
      name: "Joshua R. Lehman",
      description:
        "Joshua R. Lehman is a software engineer with 18+ years of experience in full‑stack development, industrial automation, and cloud-native architecture.",
      url: "https://joshlehman.ca",
      image: "https://joshlehman.ca/joshua-lehman.jpg",
      sameAs: [
        "https://github.com/joshl26/",
        "https://www.linkedin.com/in/joshrlehman/",
      ],
      jobTitle: "Software Engineer / Full Stack Developer",
      worksFor: { "@id": "https://joshlehman.ca/#organization" },
      knowsAbout: [
        "Full‑Stack Development",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Industrial Automation",
        "Cloud Architecture",
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Software Engineer",
          description:
            "Full Stack Developer with expertise in cloud-native and industrial automation systems",
          experienceRequirements: "18+ years",
        },
      ],
      alumniOf: {
        "@type": "Organization",
        name: "Professional Software Engineering Community",
      },
      award: ["18+ Years Software Engineering Excellence"],
    },
    {
      "@type": "Organization",
      "@id": "https://joshlehman.ca/#organization",
      name: "Blackrock Design",
      url: "https://joshlehman.ca",
      logo: {
        "@type": "ImageObject",
        url: "https://joshlehman.ca/joshua-lehman.jpg",
        contentUrl: "https://joshlehman.ca/joshua-lehman.jpg",
        width: 600,
        height: 60,
        name: "Blackrock Design Logo",
      },
      founder: { "@id": "https://joshlehman.ca/#person" },
      foundingDate: "2018-01-01",
      slogan: "Innovative Software Engineering & Web Development",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        addressCountry: "CA",
        areaServed: ["CA", "US", "Remote"],
        postalCode: "L5G 0A3",
        streetAddress: "1 Hurontario St.",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "joshl26@hotmail.com",
        telephone: "+1-905-990-2810",
        contactType: "customer service",
        areaServed: ["CA", "US", "Remote"],
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
          validFrom: "2023-01-01",
          validThrough: "2025-12-31",
        },
      },
      sameAs: [
        "https://github.com/joshl26/",
        "https://www.linkedin.com/in/joshrlehman/",
      ],
      knowsAbout: [
        "Software Development",
        "Web Development",
        "Cloud Solutions",
        "Industrial Automation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://joshlehman.ca/#website",
      name: "Joshua R. Lehman Portfolio",
      alternateName: "Joshua R. Lehman - Software Engineer & Web Developer",
      url: "https://joshlehman.ca",
      description:
        "Portfolio website showcasing software engineering projects, web development work, and technical blog posts by Joshua R. Lehman.",
      publisher: { "@id": "https://joshlehman.ca/#organization" },
      mainEntity: { "@id": "https://joshlehman.ca/#person" },
      inLanguage: "en-US",
      copyrightYear: 2025,
      copyrightHolder: { "@id": "https://joshlehman.ca/#person" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://joshlehman.ca/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      hasPart: [
        {
          "@type": "Blog",
          "@id": "https://joshlehman.ca/blog/#blog",
          name: "Joshua R. Lehman's Technical Blog",
          description:
            "Technical blog covering software engineering, web development, and programming insights.",
          url: "https://joshlehman.ca/blog",
          author: { "@id": "https://joshlehman.ca/#person" },
          publisher: { "@id": "https://joshlehman.ca/#organization" },
          keywords: [
            "software engineering",
            "web development",
            "programming",
            "technical blog",
            "React",
            "Next.js",
            "TypeScript",
          ],
          audience: {
            "@type": "Audience",
            audienceType: "Developers, Engineers, Tech Enthusiasts",
          },
        },
        {
          "@type": "CreativeWork",
          "@id": "https://joshlehman.ca/projects/#portfolio",
          name: "Software Development Portfolio",
          description:
            "Collection of software engineering and web development projects.",
          url: "https://joshlehman.ca/projects",
          creator: { "@id": "https://joshlehman.ca/#person" },
          publisher: { "@id": "https://joshlehman.ca/#organization" },
          keywords: [
            "software projects",
            "portfolio",
            "React",
            "Next.js",
            "TypeScript",
            "C++",
          ],
          audience: {
            "@type": "Audience",
            audienceType: "Potential Clients, Recruiters",
          },
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://joshlehman.ca/#service",
      name: "Joshua R. Lehman Portfolio & Services",
      url: "https://joshlehman.ca",
      description:
        "Professional software engineering and web development services. Specializing in full-stack development, React apps, and innovative digital solutions.",
      provider: { "@id": "https://joshlehman.ca/#organization" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        addressCountry: "CA",
        postalCode: "L5G 0A3",
        streetAddress: "1 Hurontario St.",
      },
      telephone: "+1-905-990-2810",
      priceRange: "$3000–$100000",
      image: "https://joshlehman.ca/og/og-home.png",
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: "43.5890",
          longitude: "-79.6441",
        },
        geoRadius: "10000000",
      },
      areaServed: [
        "Toronto",
        "Mississauga",
        "Greater Toronto Area",
        "Ontario",
        "Canada",
        "North America",
        "Remote",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Software Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            priceRange: "$5000 - $50000",
            availability: "InStock",
            itemOffered: {
              "@type": "Service",
              name: "Full-Stack Web Development",
              description:
                "Complete web application development using React, Next.js, and Node.js.",
              serviceType: "Web Development",
              category: "Software Development",
            },
          },
          {
            "@type": "Offer",
            priceRange: "$3000 - $20000",
            availability: "InStock",
            itemOffered: {
              "@type": "Service",
              name: "Frontend Development",
              description:
                "Responsive, accessible, and interactive interfaces with React, TypeScript, and CSS.",
              serviceType: "Frontend Development",
              category: "Software Development",
            },
          },
          {
            "@type": "Offer",
            priceRange: "$3000 - $25000",
            availability: "InStock",
            itemOffered: {
              "@type": "Service",
              name: "Backend Development",
              description:
                "Server-side development, APIs, and database integrations.",
              serviceType: "Backend Development",
              category: "Software Development",
            },
          },
          {
            "@type": "Offer",
            priceRange: "$2000 - $15000",
            availability: "InStock",
            itemOffered: {
              "@type": "Service",
              name: "Technical Consulting",
              description:
                "Advisory services, code review, and architecture planning.",
              serviceType: "Consulting",
              category: "Professional Services",
            },
          },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "12",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://joshlehman.ca/#breadcrumblist",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://joshlehman.ca/",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://joshlehman.ca/#webpage",
      url: "https://joshlehman.ca",
      name: "Joshua R. Lehman - Software Engineer & Full Stack Developer",
      description:
        "Professional software engineering and web development services. Specializing in full-stack development, React apps, and innovative digital solutions.",
      isPartOf: { "@id": "https://joshlehman.ca/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://joshlehman.ca/og/og-home.png",
        width: 1200,
        height: 630,
      },
      mainEntity: { "@id": "https://joshlehman.ca/#service" },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".intro", ".service-description"],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        "@id": "https://joshlehman.ca/#breadcrumblist",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://joshlehman.ca/",
          },
        ],
      },
    },
  ],
};
