import React from 'react';
import { Metadata } from 'next';
import { BarChart3, Globe, MousePointerClick, QrCode, ShieldCheck } from 'lucide-react';

// Tipado para los parámetros en Next.js 15/16
type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Analíticas: ${slug} | Swarve` };
}

export default async function AnalyticsPage({ params }: { params: Params }) {
  // En Next.js 15+, params es una Promesa que debe ser "awaited"
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
            Analíticas de /{slug}
          </h1>
          <p className="text-gray-400 mt-1">Monitorea el rendimiento y el origen de tus clics en tiempo real.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition">
            <QrCode size={18} />
            Descargar QR
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition">
            Editar Link
          </button>
        </div>
      </div>

      {/* Grid de Stats Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Clics', value: '1,284', icon: MousePointerClick, color: 'text-blue-400' },
          { label: 'Escaneos QR', value: '450', icon: QrCode, color: 'text-violet-400' },
          { label: 'Ubicaciones', value: '12 países', icon: Globe, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={stat.color} size={24} />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Live</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sección de IP Logger / Logs Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="text-blue-400" size={20} />
              Registro de Actividad (IP Logger)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-500 bg-white/5">
                  <th className="px-6 py-4 font-medium">Dirección IP</th>
                  <th className="px-6 py-4 font-medium">Ubicación</th>
                  <th className="px-6 py-4 font-medium">Dispositivo</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {/* Ejemplo de fila - Aquí mapearías tus datos reales */}
                <tr className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-mono text-sm text-blue-300">192.168.1.45</td>
                  <td className="px-6 py-4 text-sm">Madrid, ES</td>
                  <td className="px-6 py-4 text-sm text-gray-400">Chrome / Windows</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Hace 2 min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar de Acciones Rápidas */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-blue-500/20 p-6 rounded-2xl">
            <h3 className="font-semibold mb-2">Tip de Swarve</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Estás usando el **QR Dinámico**. Puedes cambiar la URL de destino de este link y el código QR impreso seguirá funcionando sin cambios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}