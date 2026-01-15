import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Wrench, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

const maintenanceItems = [
  {
    id: 1,
    station: 'Station Lagos Centre',
    component: 'Connecteur Type 2 - Borne #3',
    riskScore: 92,
    predictedFailure: '3-5 jours',
    priority: 'Critique',
    recommendation: 'Remplacement immédiat recommandé',
    lastMaintenance: '45 jours',
  },
  {
    id: 2,
    station: 'Station Nairobi Est',
    component: 'Système de refroidissement',
    riskScore: 78,
    predictedFailure: '7-10 jours',
    priority: 'Haute',
    recommendation: 'Inspection et entretien préventif',
    lastMaintenance: '62 jours',
  },
  {
    id: 3,
    station: 'Station Johannesburg Sud',
    component: 'Module de communication',
    riskScore: 65,
    predictedFailure: '14-21 jours',
    priority: 'Moyenne',
    recommendation: 'Planifier maintenance dans 2 semaines',
    lastMaintenance: '28 jours',
  },
  {
    id: 4,
    station: 'Station Accra Ouest',
    component: 'Câble d\'alimentation - Borne #2',
    riskScore: 58,
    predictedFailure: '21-30 jours',
    priority: 'Moyenne',
    recommendation: 'Surveillance accrue, inspection visuelle',
    lastMaintenance: '38 jours',
  },
  {
    id: 5,
    station: 'Station Le Caire Nord',
    component: 'Écran tactile - Borne #7',
    riskScore: 45,
    predictedFailure: '30+ jours',
    priority: 'Basse',
    recommendation: 'Maintenance de routine lors du prochain cycle',
    lastMaintenance: '21 jours',
  },
];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'Critique':
      return { color: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-300' };
    case 'Haute':
      return { color: 'bg-orange-500', textColor: 'text-orange-700', borderColor: 'border-orange-300' };
    case 'Moyenne':
      return { color: 'bg-yellow-500', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' };
    case 'Basse':
      return { color: 'bg-blue-500', textColor: 'text-blue-700', borderColor: 'border-blue-300' };
    default:
      return { color: 'bg-gray-500', textColor: 'text-gray-700', borderColor: 'border-gray-300' };
  }
};

export function PredictiveMaintenance() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Maintenance Prédictive Basée sur l'Historique</h2>
          <p className="text-gray-600">Analyse des incidents passés et modèles statistiques simples - Décision validée par l'humain</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <span className="text-2xl text-red-900">1</span>
            </div>
            <p className="text-sm text-red-800">Interventions critiques</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-8 h-8 text-orange-600" />
              <span className="text-2xl text-orange-900">2</span>
            </div>
            <p className="text-sm text-orange-800">Priorité haute</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl text-yellow-900">5</span>
            </div>
            <p className="text-sm text-yellow-800">Planifiées ce mois</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl text-emerald-900">-23%</span>
            </div>
            <p className="text-sm text-emerald-800">Réduction coûts vs prév.</p>
          </Card>
        </div>

        {/* Maintenance Items */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg mb-6 text-gray-900">Équipements nécessitant une attention - Priorisés par IA</h3>
          <div className="space-y-4">
            {maintenanceItems.map((item) => {
              const config = getPriorityConfig(item.priority);
              
              return (
                <div
                  key={item.id}
                  className={`p-5 border-l-4 ${config.borderColor} bg-gray-50 rounded-lg hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base text-gray-900">{item.station}</h4>
                        <Badge variant="outline" className={config.textColor}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{item.component}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Score de risque</p>
                      <p className={`text-2xl ${config.textColor}`}>{item.riskScore}%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Probabilité de panne</span>
                      <span>{item.riskScore}%</span>
                    </div>
                    <Progress value={item.riskScore} className="h-2" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Panne prédite dans</p>
                      <p className="text-gray-900">{item.predictedFailure}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Dernière maintenance</p>
                      <p className="text-gray-900">{item.lastMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Recommandation IA</p>
                      <p className="text-gray-900">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Insights de l'Intelligence Artificielle
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-white/90 mb-1">Tendance détectée</p>
              <p className="text-base">
                Les défaillances de connecteurs augmentent de 15% en saison chaude. 
                Recommandation : renforcer la surveillance.
              </p>
            </div>
            <div>
              <p className="text-sm text-white/90 mb-1">Optimisation suggérée</p>
              <p className="text-base">
                Grouper les interventions à Lagos et Accra permettrait une réduction de 30% des coûts logistiques.
              </p>
            </div>
            <div>
              <p className="text-sm text-white/90 mb-1">Prévision</p>
              <p className="text-base">
                Avec la maintenance prédictive, le taux de disponibilité devrait atteindre 97% d'ici 3 mois.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}