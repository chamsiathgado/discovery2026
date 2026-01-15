import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg">KEMET</span>
                <p className="text-xs text-gray-400">AfricaCharge Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Solution intelligente et opérationnelle pour l'optimisation des réseaux de recharge électrique en Afrique.
            </p>
          </div>
          <div>
            <h3 className="text-base mb-4">Fonctionnalités</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Tableau de bord temps réel</li>
              <li>Carte géographique</li>
              <li>Alertes intelligentes</li>
              <li>Maintenance prédictive</li>
              <li>Rapports institutionnels</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base mb-4">Pour les institutions</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Autorités publiques</li>
              <li>Opérateurs d'infrastructures</li>
              <li>Administrations énergétiques</li>
              <li>Régulateurs sectoriels</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base mb-4">KEMET</h3>
            <p className="text-sm text-gray-400 mb-3">
              Expert en solutions digitales pour la transition énergétique africaine.
            </p>
            <div className="bg-emerald-600/20 border border-emerald-600 px-3 py-2 rounded text-xs text-emerald-300">
              Phase Pilote Active • POC Opérationnel
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 KEMET - AfricaCharge Platform. Tous droits réservés.</p>
          <p className="mt-2">POC Faisable et Déployable • Solution Technique Prête • Technologies Éprouvées</p>
        </div>
      </div>
    </footer>
  );
}