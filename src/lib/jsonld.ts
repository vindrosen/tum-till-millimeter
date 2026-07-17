import { site } from "./site";
import { faq, dimensioner } from "./data";
import { mmValue } from "./format";

export function buildJsonLd() {
  const webSite = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "sv-SE",
  };

  const webApp = {
    "@type": "WebApplication",
    "@id": `${site.url}/#app`,
    name: site.name,
    url: site.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "sv-SE",
    description:
      "Omvandla tum till millimeter och slå upp virkesdimensioner som 2x4, 2x6 och 1x6 samt byggord.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK" },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.fraga,
      acceptedAnswer: { "@type": "Answer", text: f.svar },
    })),
  };

  const dimensionList = {
    "@type": "ItemList",
    "@id": `${site.url}/#dimensioner`,
    name: "Vanliga virkesdimensioner",
    itemListElement: dimensioner.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${d.namn} (${d.tum})`,
      description: `Hyvlat ${d.hyvlat.t}×${d.hyvlat.b} mm, ohyvlat ${d.ohyvlat.t}×${d.ohyvlat.b} mm. ${d.anvandning}`,
    })),
  };

  const tumFakta = {
    "@type": "DefinedTerm",
    name: "Tum",
    description: `Ett tum motsvarar ${mmValue(25.4)} mm. Används för att beskriva virkesdimensioner som 2×4 och 1×6.`,
    inDefinedTermSet: `${site.url}/#byggordbok`,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webSite, webApp, faqPage, dimensionList, tumFakta],
  };
}
