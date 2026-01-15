import { Zap, Menu, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-900">KEMET <span className="text-emerald-600"></span></h1>
              <p className="text-xs text-gray-500">Plateforme d'Administration Intelligente - Solution Opérationnelle</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden md:block">Phase Pilote Active</span>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Administrateur
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}