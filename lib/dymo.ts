import DymoAPI from "dymo-api";

// Inicializamos la SDK
const dymoSDK = new DymoAPI({
  apiKey: process.env.DYMO_API_KEY || "",
});

export const dymo = {
  /**
   * Verifica si una URL es segura usando la SDK oficial.
   */
  async verifyUrlSafety(url: string): Promise<{ safe: boolean; reason?: string }> {
    try {
      // Usamos el método nativo de la librería
      const response = await dymoSDK.isValidDataRaw({ url });
      
      return {
        safe: !response.url.fraud,
        reason: response.url.fraud ? 'URL marcada como insegura por Dymo Security.' : undefined
      };
    } catch (error) {
      console.error("🛡️ Dymo SDK scan failure:", error);
      return { safe: true }; // Fallback: permitir en caso de error de red
    }
  },

  /**
   * Obtiene analíticas de IP usando el validador de la SDK.
   * Esto reemplaza o complementa a IPWhois con datos de TPE Oficial.
   */
  async getIpAnalytics(ip: string) {
    try {
      const response = await dymoSDK.isValidDataRaw({ ip });
      const data = response.ip;

      return {
        city: data.city,
        country: data.country,
        isp: data.isp,
        isVpn: data.proxy || data.hosting, // Dymo detecta si es Proxy o Hosting (bots)
        type: data.type, // IPv4 o IPv6
        region: data.regionName
      };
    } catch (error) {
      console.error("Dymo IP Analytics failure:", error);
      return null;
    }
  },

  /**
   * Metadatos con Microlink (API externa via fetch)
   */
  async getUrlMetadata(url: string) {
    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const { data } = await res.json();
      return {
        title: data.title,
        description: data.description,
        image: data.image?.url
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Validación de formato con Abstract API (API externa via fetch)
   */
  async validateUrlFormat(url: string) {
    try {
      const res = await fetch(`https://urlvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&url=${url}`);
      const data = await res.json();
      return data.is_valid_format?.value ?? true;
    } catch (error) {
      return true;
    }
  },

  // Mantener tus otros métodos de status e incidentes...
  async getStatus() {
    try {
      const res = await fetch('https://api.tpeoficial.com/v1/status', {
        headers: { 'Authorization': `Bearer ${process.env.DYMO_API_KEY}` },
        next: { revalidate: 60 }
      });
      return res.ok ? res.json() : { status: 'unknown' };
    } catch {
      return { status: 'offline' };
    }
  }
};

// Exports para actions.ts
export const verifyUrlSafety = dymo.verifyUrlSafety;
export const getIpAnalytics = dymo.getIpAnalytics;
export const getUrlMetadata = dymo.getUrlMetadata;