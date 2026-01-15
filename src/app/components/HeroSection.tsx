import { Zap, TrendingUp, Target, MapPin } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-4">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Solution KEMET - Déployable Immédiatement</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-900">
            Optimisation des Réseaux de Recharge Électrique en Afrique
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une solution techniquement faisable et opérationnellement éprouvée pour les autorités publiques, 
            opérateurs d'infrastructures et administrations énergétiques
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <span className="text-sm">✓ Technologies existantes • ✓ Données exploitables • ✓ ROI mesurable</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contexte & Problématique */}
          <Card className="p-6 bg-white">
            <h2 className="text-2xl mb-4 text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Contexte & Problématique Réelle
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Croissance progressive des véhicules électriques en Afrique</h3>
                <p className="text-sm">
                  Le marché africain des véhicules électriques connaît une croissance mesurée mais constante, 
                  nécessitant une infrastructure de recharge adaptée aux contextes locaux.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contraintes opérationnelles majeures</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Instabilité et capacité limitée du réseau électrique</li>
                  <li>Coûts d'exploitation élevés et marges réduites</li>
                  <li>Manque d'outils numériques de pilotage centralisé</li>
                  <li>Maintenance réactive et imprévisible</li>
                  <li>Absence de données exploitables pour la décision</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  <strong>Besoin identifié :</strong> Une solution digitale réaliste, faisable et adaptée 
                  aux contraintes africaines, déployable progressivement.
                </p>
              </div>
            </div>
          </Card>

          {/* Objectifs de la plateforme */}
          <Card className="p-6 bg-white">
            <h2 className="text-2xl mb-4 text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Objectifs de la Plateforme KEMET
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Améliorer la disponibilité opérationnelle</h3>
                  <p className="text-sm text-gray-600">Via capteurs IoT et monitoring temps réel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Réduire les coûts de maintenance</h3>
                  <p className="text-sm text-gray-600">Grâce à l'analyse d'historique et prédictions basiques</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Optimiser la gestion énergétique</h3>
                  <p className="text-sm text-gray-600">Suivi par compteurs connectés et API réseau</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Aide à la décision fiable et mesurable</h3>
                  <p className="text-sm text-gray-600">Indicateurs concrets et tableaux de bord exploitables</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Rôle de l'IA */}
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            Rôle de l'Intelligence Artificielle (Pragmatique et Maîtrisable)
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-4">
            <div>
              <h3 className="font-semibold mb-2">Analyse statistique et IA</h3>
              <p className="text-sm text-white/90">
                Modèles simples basés sur l'historique réel des incidents et de l'usage
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Détection d'anomalies</h3>
              <p className="text-sm text-white/90">
                Algorithmes éprouvés et seuils paramétrables par les opérateurs
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recommandations explicables</h3>
              <p className="text-sm text-white/90">
                Suggestions automatiques validées par l'humain, pas de boîte noire
              </p>
            </div>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-white/95">
              ⚠️ <strong>L'IA est un outil d'aide à la décision</strong>, déployable progressivement, 
              qui ne remplace pas l'expertise humaine mais l'augmente.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}