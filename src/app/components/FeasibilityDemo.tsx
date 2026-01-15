import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { CheckCircle, Database, Cloud, Cpu, TrendingUp, Users, DollarSign } from 'lucide-react';

const technologies = [
  {
    icon: Database,
    title: 'Collecte de données',
    items: [
      'Capteurs IoT standard (température, courant, tension)',
      'Logs système des bornes existantes',
      'API REST des équipementiers (ABB, Schneider, etc.)',
      'Compteurs électriques connectés déjà déployés',
    ],
    status: 'Disponible',
  },
  {
    icon: Cloud,
    title: 'Infrastructure cloud',
    items: [
      'Hébergement cloud multi-région (AWS/Azure/GCP)',
      'Base de données PostgreSQL + TimescaleDB',
      'API sécurisées (OAuth2, TLS)',
      'Backup automatisé et réplication',
    ],
    status: 'Opérationnel',
  },
  {
    icon: Cpu,
    title: 'Traitement & IA',
    items: [
      'Modèles ML supervisés (Scikit-learn, TensorFlow)',
      'Détection d\'anomalies par seuils statistiques',
      'Prédiction basée sur séries temporelles (ARIMA)',
      'Dashboard temps réel (React + WebSocket)',
    ],
    status: 'Éprouvé',
  },
];

const deploymentPhases = [
  {
    phase: 'Phase 1 - Pilote',
    duration: '3 mois',
    description: 'Déploiement sur 2-3 stations test avec collecte de données',
    deliverables: ['Connexion bornes', 'Dashboard basique', 'Premiers KPIs'],
    status: 'En cours',
  },
  {
    phase: 'Phase 2 - Validation',
    duration: '3 mois',
    description: 'Extension à 10-15 stations, activation IA prédictive',
    deliverables: ['Module alertes', 'Maintenance prédictive', 'Formation équipes'],
    status: 'Planifié',
  },
  {
    phase: 'Phase 3 - Déploiement',
    duration: '6 mois',
    description: 'Montée en charge nationale, intégration complète',
    deliverables: ['Réseau complet', 'Rapports institutionnels', 'Support 24/7'],
    status: 'Feuille de route',
  },
];

const roiMetrics = [
  { metric: 'Réduction coûts maintenance', value: '25-30%', timeframe: '12 mois' },
  { metric: 'Amélioration disponibilité', value: '+8-12%', timeframe: '6 mois' },
  { metric: 'Temps intervention réduit', value: '-40%', timeframe: '9 mois' },
  { metric: 'Retour sur investissement', value: '18-24 mois', timeframe: 'Projet complet' },
];

export function FeasibilityDemo() {
  return (
    <section className="bg-white py-16 px-6 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-600">Section Critique</Badge>
          <h2 className="text-4xl text-gray-900 mb-4">Démonstration de la Faisabilité du Projet</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            KEMET s'appuie sur des technologies éprouvées et un déploiement progressif 
            pour garantir la réussite opérationnelle
          </p>
        </div>

        {/* Technologies disponibles */}
        <div className="mb-12">
          <h3 className="text-2xl text-gray-900 mb-6">Technologies Numériques Déjà Disponibles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <Card key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10 text-emerald-600" />
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                      {tech.status}
                    </Badge>
                  </div>
                  <h4 className="text-lg text-gray-900 mb-3">{tech.title}</h4>
                  <ul className="space-y-2">
                    {tech.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sources de données */}
        <Card className="p-8 bg-blue-50 border-2 border-blue-200 mb-12">
          <h3 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
            <Database className="w-7 h-7 text-blue-600" />
            Données Nécessaires et Accessibles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Sources de données primaires</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Bornes de recharge :</strong> État, puissance, temps de charge (API constructeur)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Compteurs électriques :</strong> Consommation en kWh, pics de charge (Modbus/MQTT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Capteurs IoT :</strong> Température, humidité, vibrations (LoRaWAN/4G)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Système maintenance :</strong> Historique interventions, tickets (Base existante)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fréquence de collecte</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Temps réel :</strong> État bornes, alertes critiques (1-5 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Quotidien :</strong> Consommation, utilisation, disponibilité</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Hebdomadaire :</strong> Rapports maintenance, tendances</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-gray-700"><strong>Mensuel :</strong> Analyses prédictives, KPIs stratégiques</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Déploiement progressif */}
        <div className="mb-12">
          <h3 className="text-2xl text-gray-900 mb-6">Déploiement Progressif et Maîtrisé</h3>
          <div className="space-y-4">
            {deploymentPhases.map((phase, index) => (
              <Card key={index} className="p-6 bg-white border-l-4 border-emerald-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg text-gray-900">{phase.phase}</h4>
                      <Badge variant="outline" className={
                        phase.status === 'En cours' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        phase.status === 'Planifié' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }>
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Durée</span>
                    <p className="text-base text-gray-900">{phase.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">Livrables :</span>
                  {phase.deliverables.map((deliverable, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Intégration et ROI */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Intégration avec l'Existant
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Compatible avec toutes les marques de bornes (OCPP standard)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Connexion aux systèmes de gestion existants via API REST</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Formation des équipes locales (3 jours par phase)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Support technique dédié et documentation complète</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Migration progressive sans interruption de service</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
            <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              ROI et Coûts Maîtrisables
            </h3>
            <div className="space-y-3">
              {roiMetrics.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.metric}</span>
                    <span className="text-base text-emerald-700">{item.value}</span>
                  </div>
                  <span className="text-xs text-gray-500">Horizon : {item.timeframe}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-emerald-100 p-3 rounded-lg border border-emerald-300">
              <p className="text-sm text-emerald-800">
                <strong>Investissement initial estimé :</strong> Modulaire selon taille du réseau. 
                Mode SaaS disponible pour réduire les coûts initiaux.
              </p>
            </div>
          </Card>
        </div>

        {/* Conclusion faisabilité */}
        <Card className="p-8 bg-gradient-to-r from-emerald-600 to-blue-600 text-white mt-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl mb-3">KEMET Peut Réellement Mettre en Œuvre Cette Solution</h3>
            <p className="text-base text-white/95 max-w-3xl mx-auto mb-4">
              Ce POC démontre que la plateforme KEMET s'appuie sur des technologies matures, 
              des sources de données accessibles, un déploiement progressif sécurisé et un retour sur investissement mesurable. 
              La solution est prête pour une phase pilote immédiate.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Techniquement faisable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Opérationnellement viable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Économiquement rentable</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
