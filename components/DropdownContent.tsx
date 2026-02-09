// components/DropdownContent.tsx
import Link from 'next/link';

interface DropdownItem {
  name: string;
  description: string;
  href: string;
  icon: React.FC<any>; 
}

export function DropdownContent({ content }: { content: DropdownItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2"> 
      {content.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-zinc-900 transition-all duration-200 border border-transparent hover:border-zinc-800"
        >
          {/* Icono con tu color esmeralda */}
          <div className="flex-shrink-0 p-2 rounded-lg bg-zinc-900 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            <item.icon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Título */}
            <p className="text-[11px] font-black uppercase tracking-widest text-white">
              {item.name}
            </p>
            {/* Descripción con truncado automático (...) */}
            <p className="mt-0.5 text-[10px] font-medium text-zinc-500 truncate block">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}