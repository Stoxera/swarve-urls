export const externalApis = {
  /**
   * Obtiene metadatos y preview de la URL usando Microlink.
   */
  async getUrlMetadata(url: string) {
    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`, {
        next: { revalidate: 3600 } 
      });
      const { data } = await res.json();
      return {
        title: data.title,
        description: data.description,
        image: data.image?.url,
      };
    } catch (error) {
      console.error("Microlink failure:", error);
      return null;
    }
  },

  /**
   * Verifica si el dominio existe y es válido usando Abstract API.
   */
  async validateUrlFormat(url: string) {
    try {
      const apiKey = process.env.ABSTRACT_API_KEY;
      const res = await fetch(`https://urlvalidation.abstractapi.com/v1/?api_key=${apiKey}&url=${url}`);
      const data = await res.json();
      return data.is_valid_format?.value ?? true;
    } catch (error) {
      return true;
    }
  },

  /**
   * Categoriza el contenido y extrae el logo usando Klazify.
   */
  async categorizeUrl(url: string) {
    try {
      const res = await fetch("https://www.klazify.com/api/categorize", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.KLAZIFY_API_KEY}`,
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      return {
        category: data.domain_group?.name || "Uncategorized",
        logo: data.domain_logo?.logo_url,
      };
    } catch (error) {
      console.error("Klazify failure:", error);
      return null;
    }
  }
};

// Exports individuales
export const getUrlMetadata = externalApis.getUrlMetadata;
export const validateUrlFormat = externalApis.validateUrlFormat;
export const categorizeUrl = externalApis.categorizeUrl;